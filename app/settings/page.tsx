'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/lib/hooks/useSettings';
import { AIProvider, providerConfigs } from '@/lib/types/settings';
import { exportBackup, readBackupFile, importBackup, BackupData } from '@/lib/storage/backup';

interface ModelInfo {
  id: string;
  name?: string;
}

// モデル名を短縮形で表示
function getShortModelName(modelId: string): string {
  // パス形式の場合、ファイル名部分を抽出
  const parts = modelId.split('/');
  let name = parts[parts.length - 1];

  // 拡張子を除去
  name = name.replace(/\.(gguf|bin|safetensors)$/i, '');

  // 長すぎる場合は省略
  if (name.length > 40) {
    return name.substring(0, 37) + '...';
  }

  return name;
}

export default function SettingsPage() {
  const router = useRouter();
  const { settings, isLoaded, updateAISettings } = useSettings();
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  // サービス状態とモデル一覧
  const [serviceStatus, setServiceStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [useManualInput, setUseManualInput] = useState(false);

  // バックアップ関連
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [previewData, setPreviewData] = useState<BackupData | null>(null);

  // タブ
  const [activeTab, setActiveTab] = useState<'ai' | 'data'>('ai');

  // モデル一覧を取得
  const fetchModels = useCallback(async (endpoint: string) => {
    setServiceStatus('checking');
    setAvailableModels([]);

    try {
      const res = await fetch(`${endpoint}/v1/models`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000), // 3秒タイムアウト
      });

      if (res.ok) {
        const data = await res.json();
        const models: ModelInfo[] = data.data?.map((m: { id: string; name?: string }) => ({
          id: m.id,
          name: m.name || m.id,
        })) || [];

        setAvailableModels(models);
        setServiceStatus('available');

        // 現在のモデルが一覧にない場合、最初のモデルを選択
        if (models.length > 0 && !models.some(m => m.id === settings.ai.model)) {
          updateAISettings({ model: models[0].id });
        }
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch {
      setServiceStatus('unavailable');
      setAvailableModels([]);
    }
  }, [settings.ai.model, updateAISettings]);

  // プロバイダー変更時にモデル一覧を取得
  const handleProviderChange = (provider: AIProvider) => {
    const config = providerConfigs[provider];
    const newEndpoint = config.defaultEndpoint;
    updateAISettings({
      provider,
      endpoint: newEndpoint,
      model: provider === 'ollama' ? 'llama3.2' : provider === 'lm-studio' ? 'loaded-model' : 'llama.cpp',
    });
    setUseManualInput(false);
    fetchModels(newEndpoint);
  };

  // 初回読み込み時にモデル一覧を取得
  useEffect(() => {
    if (isLoaded && settings.ai.endpoint) {
      fetchModels(settings.ai.endpoint);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  const testConnection = async () => {
    setTestStatus('testing');
    setTestMessage('');

    try {
      const res = await fetch(`${settings.ai.endpoint}/v1/models`, {
        method: 'GET',
      });

      if (res.ok) {
        const data = await res.json();
        setTestStatus('success');
        setTestMessage(`接続成功！モデル: ${data.data?.[0]?.id || 'unknown'}`);
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (e) {
      setTestStatus('error');
      setTestMessage(e instanceof Error ? e.message : '接続に失敗しました');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500 dark:text-gray-400"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              設定
            </h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* タブ */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'ai'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            AIサポート
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'data'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            データ管理
          </button>
        </div>

        {/* AIサポート設定タブ */}
        {activeTab === 'ai' && (
          <>
        {/* AI設定セクション */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              AI サポート設定
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              ローカルLLMを使用したAI学習サポート
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* 有効/無効トグル */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  AIサポートを有効にする
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  学習中にAIからのヒントを受け取る
                </p>
              </div>
              <button
                onClick={() => updateAISettings({ enabled: !settings.ai.enabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.ai.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.ai.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* プロバイダー選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AIプロバイダー
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(providerConfigs) as AIProvider[]).map((provider) => (
                  <button
                    key={provider}
                    onClick={() => handleProviderChange(provider)}
                    className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      settings.ai.provider === provider
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {providerConfigs[provider].name}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                {serviceStatus === 'checking' && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    接続確認中...
                  </span>
                )}
                {serviceStatus === 'available' && (
                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    サービス稼働中（{availableModels.length}モデル）
                  </span>
                )}
                {serviceStatus === 'unavailable' && (
                  <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="m15 9-6 6"/>
                      <path d="m9 9 6 6"/>
                    </svg>
                    サービス未起動
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {providerConfigs[settings.ai.provider || 'llama.cpp'].description}
              </p>
            </div>

            {/* エンドポイント */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                サーバーエンドポイント
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.ai.endpoint}
                  onChange={(e) => updateAISettings({ endpoint: e.target.value })}
                  placeholder={providerConfigs[settings.ai.provider || 'llama.cpp'].defaultEndpoint}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => fetchModels(settings.ai.endpoint)}
                  disabled={serviceStatus === 'checking'}
                  title="モデルを再取得します"
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={serviceStatus === 'checking' ? 'animate-spin' : ''}
                  >
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                デフォルト: {providerConfigs[settings.ai.provider || 'llama.cpp'].defaultEndpoint}
              </p>
            </div>

            {/* モデル選択 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  モデル
                </label>
                {serviceStatus === 'available' && availableModels.length > 0 && (
                  <button
                    onClick={() => setUseManualInput(!useManualInput)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {useManualInput ? 'リストから選択' : '手動で入力'}
                  </button>
                )}
              </div>

              {/* サービス稼働中でモデルがある場合 */}
              {serviceStatus === 'available' && availableModels.length > 0 && !useManualInput ? (
                <select
                  value={settings.ai.model}
                  onChange={(e) => updateAISettings({ model: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {availableModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {getShortModelName(model.id)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={settings.ai.model}
                  onChange={(e) => updateAISettings({ model: e.target.value })}
                  placeholder="モデル名を入力"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}

              {serviceStatus === 'unavailable' && (
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  サービスが起動していないため、手動でモデル名を入力してください
                </p>
              )}
              {serviceStatus === 'checking' && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  利用可能なモデルを確認中...
                </p>
              )}
            </div>

            {/* 接続テスト */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={testConnection}
                disabled={testStatus === 'testing'}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                {testStatus === 'testing' ? '接続テスト中...' : '接続テスト'}
              </button>

              {testMessage && (
                <div
                  className={`mt-3 p-3 rounded-lg text-sm ${
                    testStatus === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  }`}
                >
                  {testMessage}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 使い方 - プロバイダーごとに表示 */}
        <section className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            {providerConfigs[settings.ai.provider || 'llama.cpp'].name} の起動方法
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            {(settings.ai.provider === 'llama.cpp' || !settings.ai.provider) && (
              <>
                <p>1. llama.cpp をビルドしてサーバーモードで起動:</p>
                <pre className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded overflow-x-auto">
                  ./llama-server -m model.gguf --port 8080
                </pre>
              </>
            )}
            {settings.ai.provider === 'lm-studio' && (
              <>
                <p>1. LM Studio を起動し、モデルをダウンロード</p>
                <p>2. 左サイドバーの「Local Server」タブを開く</p>
                <p>3. 「Start Server」をクリック（デフォルトポート: 1234）</p>
              </>
            )}
            {settings.ai.provider === 'ollama' && (
              <>
                <p>1. Ollama をインストール後、モデルをダウンロード:</p>
                <pre className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded overflow-x-auto">
                  ollama pull llama3.2
                </pre>
                <p>2. サーバーは自動起動（または `ollama serve` で起動）</p>
              </>
            )}
            <p className="pt-2">設定後、「接続テスト」で確認してください。</p>
          </div>
        </section>
          </>
        )}

        {/* データ管理タブ */}
        {activeTab === 'data' && (
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              データ管理
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              学習データのバックアップと復元
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* エクスポート */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                エクスポート
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                マークした単語、ユーザー教材、設定をJSON形式でダウンロードします。
              </p>
              <button
                onClick={exportBackup}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                バックアップをダウンロード
              </button>
            </div>

            {/* インポート */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                インポート
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                バックアップファイルから復元します。ファイルを選択するかドラッグ&ドロップしてください。
              </p>

              {/* ドラッグ&ドロップエリア */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={async (e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file && file.name.endsWith('.json')) {
                    try {
                      const data = await readBackupFile(file);
                      setPreviewData(data);
                      setImportStatus('idle');
                      setImportMessage('');
                    } catch (err) {
                      setImportStatus('error');
                      setImportMessage(err instanceof Error ? err.message : 'エラー');
                    }
                  }
                }}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
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
                    if (file) {
                      try {
                        const data = await readBackupFile(file);
                        setPreviewData(data);
                        setImportStatus('idle');
                        setImportMessage('');
                      } catch (err) {
                        setImportStatus('error');
                        setImportMessage(err instanceof Error ? err.message : 'エラー');
                      }
                    }
                  }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-2 text-gray-400"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  ここにファイルをドラッグ&ドロップ
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  またはファイルを選択
                </button>
              </div>

              {/* プレビュー */}
              {previewData && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    バックアップの内容
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>エクスポート日時: {new Date(previewData.exportedAt).toLocaleString('ja-JP')}</li>
                    <li>マークした単語: {Object.values(previewData.markedWords).reduce((acc, arr) => acc + arr.length, 0)}個</li>
                    <li>ユーザー教材: {previewData.userMaterials.length}個</li>
                  </ul>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => {
                        const result = importBackup(previewData);
                        setImportStatus(result.success ? 'success' : 'error');
                        setImportMessage(result.message);
                        if (result.success) {
                          setPreviewData(null);
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                      インポートを実行
                    </button>
                    <button
                      onClick={() => {
                        setPreviewData(null);
                        setImportStatus('idle');
                        setImportMessage('');
                      }}
                      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              )}

              {/* インポート結果 */}
              {importMessage && (
                <div
                  className={`mt-4 p-3 rounded-lg text-sm ${
                    importStatus === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  }`}
                >
                  {importMessage}
                </div>
              )}
            </div>
          </div>
        </section>
        )}
      </main>
    </div>
  );
}
