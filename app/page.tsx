'use client';

import { useState, useReducer, useRef, useEffect } from 'react';
import Link from 'next/link';
import { builtInMaterials } from '@/data/sample-materials/north-wind-and-sun';
import { FlowReadIcon } from '@/components/ui/FlowReadIcon';
import { AddMaterialModal } from '@/components/AddMaterialModal';
import { getUserMaterials, deleteUserMaterial } from '@/lib/storage/materials';
import { readBackupFile, importBackup, BackupData } from '@/lib/storage/backup';
import { Material, MarkedWord } from '@/lib/types';

const MARKED_WORDS_PREFIX = 'flowread_marked_words_';

function getMarkedWordsCount(): number {
  if (typeof window === 'undefined') return 0;
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(MARKED_WORDS_PREFIX)) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const words: MarkedWord[] = JSON.parse(data);
          count += words.length;
        }
      } catch {
        // ignore
      }
    }
  }
  return count;
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // タブ
  const [activeTab, setActiveTab] = useState<'materials' | 'review'>('materials');

  // バックアップインポート
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // クライアントサイドでのみlocalStorageからデータを取得（hydration後）
  const [userMaterials, setUserMaterials] = useState<Material[]>([]);
  const [markedWordsCount, setMarkedWordsCount] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  // クライアントサイドでデータを読み込む
  useEffect(() => {
    setUserMaterials(getUserMaterials());
    setMarkedWordsCount(getMarkedWordsCount());
    setIsHydrated(true);
  }, []);

  const refreshData = () => {
    setUserMaterials(getUserMaterials());
    setMarkedWordsCount(getMarkedWordsCount());
    forceUpdate();
  };

  const handleMaterialAdded = () => {
    refreshData();
  };

  const handleImportFile = async (file: File) => {
    try {
      const data: BackupData = await readBackupFile(file);
      const result = importBackup(data);
      setImportMessage({ type: result.success ? 'success' : 'error', text: result.message });
      if (result.success) {
        refreshData();
        setTimeout(() => setImportMessage(null), 3000);
      }
    } catch (err) {
      setImportMessage({ type: 'error', text: err instanceof Error ? err.message : 'インポートに失敗しました' });
    }
  };

  const handleDelete = (e: React.MouseEvent, materialId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm('この教材を削除しますか？')) {
      setDeletingId(materialId);
      deleteUserMaterial(materialId);
      refreshData();
      setDeletingId(null);
    }
  };

  const allMaterials = [...builtInMaterials, ...userMaterials];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <FlowReadIcon size={36} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                FlowRead
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                訳すな。意味の流れで、理解せよ。
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* タブ */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('materials')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'materials'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
            </svg>
            教材を選ぶ
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'review'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
            </svg>
            復習する
            {markedWordsCount > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full">
                {markedWordsCount}
              </span>
            )}
          </button>
        </div>

        {/* 教材タブ */}
        {activeTab === 'materials' && (
          <div className="space-y-4">
            {allMaterials.map((material) => (
              <Link
                key={material.id}
                href={`/learn/${material.id}`}
                className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {material.title}
                      </h3>
                      {material.isBuiltIn && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
                          組み込み
                        </span>
                      )}
                    </div>
                    {material.description && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {material.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                      {material.sentences.length} 文
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4 flex items-center gap-2">
                    {!material.isBuiltIn && (
                      <button
                        onClick={(e) => handleDelete(e, material.id)}
                        disabled={deletingId === material.id}
                        className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        title="削除"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      学習する
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* 教材追加ボタン */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-gray-100 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
            >
              <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>自分の教材を追加</span>
              </div>
            </button>
          </div>
        )}

        {/* 復習タブ */}
        {activeTab === 'review' && (
          <div className="space-y-6">
            {/* 復習カード */}
            <Link
              href="/review"
              className="block bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-xl">単語を復習</h3>
                  <p className="text-blue-100">
                    {markedWordsCount > 0
                      ? `${markedWordsCount} 単語をフラッシュカードで復習`
                      : 'マークした単語がありません'}
                  </p>
                </div>
                <div className="ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </div>
              </div>
            </Link>

            {/* バックアップインポート */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  データをインポート
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  バックアップファイルから単語と教材を復元します
                </p>
              </div>
              <div className="p-6">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={async (e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file && file.name.endsWith('.json')) {
                      await handleImportFile(file);
                    }
                  }}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await handleImportFile(file);
                    }}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mx-auto mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    ここにファイルをドラッグ&ドロップ
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    またはファイルを選択
                  </button>
                </div>

                {/* インポート結果メッセージ */}
                {importMessage && (
                  <div className={`mt-4 p-3 rounded-lg text-sm ${
                    importMessage.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  }`}>
                    {importMessage.text}
                  </div>
                )}
              </div>
            </div>

            {/* エクスポートへのリンク */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              バックアップのエクスポートは
              <Link href="/settings" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">
                設定
              </Link>
              から行えます
            </div>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* 折りたたみ式のコンセプト説明 */}
          <details className="group mb-4">
            <summary className="flex items-center justify-center gap-2 cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <span>FlowReadとは？</span>
              <svg
                className="w-4 h-4 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                FlowReadは、英語を翻訳するのではなく、
                <span className="font-medium text-gray-700 dark:text-gray-300">意味の流れ</span>
                として理解する力を育てます。
                左から右へ、文の順番通りに、意味を追いかけていきましょう。
              </p>
            </div>
          </details>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Don&apos;t translate. Understand the flow.
          </p>
        </div>
      </footer>

      {/* 教材追加モーダル */}
      <AddMaterialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdded={handleMaterialAdded}
      />
    </div>
  );
}
