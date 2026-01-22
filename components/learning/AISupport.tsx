'use client';

import { useState } from 'react';
import { Chunk, Sentence } from '@/lib/types';
import { AISettings } from '@/lib/types/settings';
import { useLlamaAI } from '@/lib/hooks/useLlamaAI';

interface AISupportProps {
  sentence: Sentence;
  currentChunk: Chunk;
  aiSettings: AISettings;
}

export function AISupport({ sentence, currentChunk, aiSettings }: AISupportProps) {
  const { isLoading, error, response, askAI, clearResponse } = useLlamaAI(aiSettings);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!aiSettings.enabled) {
    return null;
  }

  const handleAskAboutChunk = () => {
    const prompt = `この英文の中で「${currentChunk.text}」という部分について、この部分が文全体でどんな役割を果たしているか、意味の流れの中でどう理解すればいいか教えてください。

全文: ${sentence.originalText}

この部分は文の中で「${currentChunk.guide.role}」の役割を持っています。`;

    askAI(prompt);
    setIsExpanded(true);
  };

  const handleAskAboutSentence = () => {
    const prompt = `この英文を左から右へ、意味の流れとして理解する方法を教えてください。日本語に訳すのではなく、英語の語順のまま理解するコツを教えてください。

英文: ${sentence.originalText}`;

    askAI(prompt);
    setIsExpanded(true);
  };

  return (
    <div className="mt-6 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 overflow-hidden">
      {/* ヘッダー */}
      <div className="px-4 py-3 flex items-center justify-between bg-purple-100 dark:bg-purple-900/30">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
            <path d="M12 8V4H8"/>
            <rect width="16" height="12" x="4" y="8" rx="2"/>
            <path d="M2 14h2"/>
            <path d="M20 14h2"/>
            <path d="M15 13v2"/>
            <path d="M9 13v2"/>
          </svg>
          <span className="font-medium text-purple-900 dark:text-purple-100">
            AIサポート
          </span>
          <span className="text-xs text-purple-600 dark:text-purple-400">
            ({aiSettings.model})
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </div>

      {/* 質問ボタン */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleAskAboutChunk}
              disabled={isLoading}
              className="px-4 py-2 text-sm rounded-lg bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 hover:bg-purple-300 dark:hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              この部分について聞く
            </button>
            <button
              onClick={handleAskAboutSentence}
              disabled={isLoading}
              className="px-4 py-2 text-sm rounded-lg bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 hover:bg-purple-300 dark:hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              文全体の流れを聞く
            </button>
          </div>

          {/* ローディング */}
          {isLoading && (
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm">考え中...</span>
            </div>
          )}

          {/* エラー */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* 回答 */}
          {response && (
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {response}
              </p>
              <button
                onClick={clearResponse}
                className="mt-3 text-xs text-purple-600 dark:text-purple-400 hover:underline"
              >
                閉じる
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
