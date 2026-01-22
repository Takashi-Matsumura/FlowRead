'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Material } from '@/lib/types';
import { builtInMaterials } from '@/data/sample-materials/north-wind-and-sun';
import { FlowDisplay } from '@/components/learning/FlowDisplay';
import { AISupport } from '@/components/learning/AISupport';
import { WordCard } from '@/components/learning/WordCard';
import { useSettings } from '@/lib/hooks/useSettings';

interface MarkedWord {
  word: string;
  sentenceIndex: number;
  chunkIndex: number;
}

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const materialId = params.materialId as string;
  const { settings, isLoaded: settingsLoaded } = useSettings();

  const [material, setMaterial] = useState<Material | null>(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [markedWords, setMarkedWords] = useState<MarkedWord[]>([]);
  const [showWordList, setShowWordList] = useState(false);

  useEffect(() => {
    const found = builtInMaterials.find((m) => m.id === materialId);
    if (found) {
      setMaterial(found);
    } else {
      router.push('/');
    }
  }, [materialId, router]);

  if (!material || !settingsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  const currentSentence = material.sentences[currentSentenceIndex];
  const currentChunk = currentSentence?.chunks[currentChunkIndex];

  const handlePositionChange = (sentenceIndex: number, chunkIndex: number) => {
    setCurrentSentenceIndex(sentenceIndex);
    setCurrentChunkIndex(chunkIndex);
  };

  const handleMarkWord = (word: MarkedWord) => {
    setMarkedWords((prev) => {
      if (prev.some((w) => w.word === word.word)) return prev;
      return [...prev, word];
    });
  };

  const handleUnmarkWord = (word: string) => {
    setMarkedWords((prev) => prev.filter((w) => w.word !== word));
  };

  // 全体の進捗を計算
  const totalChunks = material.sentences.reduce((acc, s) => acc + s.chunks.length, 0);
  const completedChunks = material.sentences
    .slice(0, currentSentenceIndex)
    .reduce((acc, s) => acc + s.chunks.length, 0) + currentChunkIndex + 1;
  const progress = (completedChunks / totalChunks) * 100;
  const isCompleted = progress === 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {material.title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* マークした単語ボタン */}
            {markedWords.length > 0 && (
              <button
                onClick={() => setShowWordList(!showWordList)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                </svg>
                {markedWords.length}
              </button>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progress)}%
            </span>
            <Link
              href="/settings"
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="設定"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </Link>
          </div>
        </div>
        {/* プログレスバー */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 意味の流れ表示 */}
        <FlowDisplay
          material={material}
          currentSentenceIndex={currentSentenceIndex}
          currentChunkIndex={currentChunkIndex}
          onPositionChange={handlePositionChange}
          markedWords={markedWords}
          onMarkWord={handleMarkWord}
          onUnmarkWord={handleUnmarkWord}
        />

        {/* AIサポート */}
        {currentChunk && (
          <AISupport
            sentence={currentSentence}
            currentChunk={currentChunk}
            aiSettings={settings.ai}
          />
        )}

        {/* 完了メッセージ */}
        {isCompleted && (
          <div className="mt-8 p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
              読了しました！
            </h3>
            <p className="text-green-700 dark:text-green-300">
              「{material.title}」を最後まで読み終えました。
              {markedWords.length > 0 && (
                <span className="block mt-2">
                  マークした単語が {markedWords.length} 個あります。
                  上部のブックマークボタンから確認できます。
                </span>
              )}
            </p>
          </div>
        )}
      </main>

      {/* マークした単語のサイドパネル */}
      {showWordList && (
        <div className="fixed inset-0 z-30" onClick={() => setShowWordList(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <div
            className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                マークした単語
              </h2>
              <button
                onClick={() => setShowWordList(false)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
              {markedWords.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  マークした単語はありません。
                  <br />
                  単語を右クリックしてマークできます。
                </p>
              ) : (
                <div className="space-y-3">
                  {markedWords.map((word, index) => (
                    <WordCard
                      key={index}
                      markedWord={word}
                      material={material}
                      aiSettings={settings.ai}
                      onUnmark={handleUnmarkWord}
                      onJumpTo={(sIndex, cIndex) => {
                        handlePositionChange(sIndex, cIndex);
                        setShowWordList(false);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
