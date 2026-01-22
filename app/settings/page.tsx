'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSettings } from '@/lib/hooks/useSettings';

export default function SettingsPage() {
  const { settings, isLoaded, updateAISettings } = useSettings();
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

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
          <Link
            href="/"
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
          </Link>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            設定
          </h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* AI設定セクション */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              AI サポート設定
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              llama.cpp サーバーを使用したAI学習サポート
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

            {/* エンドポイント */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                サーバーエンドポイント
              </label>
              <input
                type="text"
                value={settings.ai.endpoint}
                onChange={(e) => updateAISettings({ endpoint: e.target.value })}
                placeholder="http://localhost:8080"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                llama.cpp serverのURLを入力（例: http://localhost:8080）
              </p>
            </div>

            {/* モデル名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                モデル名（表示用）
              </label>
              <input
                type="text"
                value={settings.ai.model}
                onChange={(e) => updateAISettings({ model: e.target.value })}
                placeholder="llama.cpp"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Temperature: {settings.ai.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.ai.temperature}
                onChange={(e) => updateAISettings({ temperature: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>正確</span>
                <span>創造的</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                最大トークン数: {settings.ai.maxTokens}
              </label>
              <input
                type="range"
                min="64"
                max="512"
                step="64"
                value={settings.ai.maxTokens}
                onChange={(e) => updateAISettings({ maxTokens: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>短い</span>
                <span>長い</span>
              </div>
            </div>

            {/* 接続テスト */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={testConnection}
                disabled={testStatus === 'testing'}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                {testStatus === 'testing' ? '接続テスト中...' : '接続をテスト'}
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

        {/* 使い方 */}
        <section className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            llama.cpp サーバーの起動方法
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p>1. llama.cpp をビルドしてサーバーモードで起動:</p>
            <pre className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded overflow-x-auto">
              ./llama-server -m model.gguf --port 8080
            </pre>
            <p>2. 上記のエンドポイントを設定して接続テストを実行</p>
          </div>
        </section>
      </main>
    </div>
  );
}
