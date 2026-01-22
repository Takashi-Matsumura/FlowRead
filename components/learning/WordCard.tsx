'use client';

import { useState } from 'react';
import { Material, MarkedWord } from '@/lib/types';
import { AISettings } from '@/lib/types/settings';
import { useLlamaAI } from '@/lib/hooks/useLlamaAI';

interface WordCardProps {
  markedWord: MarkedWord;
  material: Material;
  aiSettings: AISettings;
  onUnmark: (word: string) => void;
  onJumpTo: (sentenceIndex: number, chunkIndex: number) => void;
}

export function WordCard({ markedWord, material, aiSettings, onUnmark, onJumpTo }: WordCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isLoading, error, response, askAI, clearResponse } = useLlamaAI(aiSettings);

  const sentence = material.sentences[markedWord.sentenceIndex];
  const chunk = sentence?.chunks[markedWord.chunkIndex];

  const handleLookup = () => {
    if (!aiSettings.enabled) {
      return;
    }
    const prompt = `英単語「${markedWord.word}」について、以下の形式で教えてください。

【品詞】（例: verb, noun, adjective など）

【English Definition】
（英英辞書のように、英語で簡潔に定義してください）

【この文脈での意味】
文: ${sentence.originalText}
部分: ${chunk?.text || ''}
（この文脈で「${markedWord.word}」がどんなニュアンスで使われているか、日本語で説明してください。直訳ではなく、感覚的な理解を促す説明をお願いします）

【例文】
（この単語を使った短い例文を1つ）`;

    askAI(prompt);
    setIsExpanded(true);
  };

  const typeLabel = markedWord.type === 'new' ? '知らなかった' : '忘れてしまった';
  const typeBgColor = markedWord.type === 'new'
    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
    : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300';
  const cardBorderColor = markedWord.type === 'new'
    ? 'border-l-4 border-l-blue-400 dark:border-l-blue-500'
    : 'border-l-4 border-l-amber-400 dark:border-l-amber-500';

  return (
    <div className={`rounded-lg bg-gray-50 dark:bg-gray-700/50 overflow-hidden ${cardBorderColor}`}>
      {/* 単語ヘッダー */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                {markedWord.word}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeBgColor}`}>
                {markedWord.type === 'new' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                    <path d="M3 3v5h5"/>
                  </svg>
                )}
                {typeLabel}
              </span>
            </div>
            {chunk && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 italic">
                &quot;...{chunk.text}...&quot;
              </p>
            )}
          </div>
          <button
            onClick={() => onUnmark(markedWord.word)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs"
          >
            削除
          </button>
        </div>

        {/* アクションボタン */}
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => {
              onJumpTo(markedWord.sentenceIndex, markedWord.chunkIndex);
            }}
            className="px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50"
          >
            この場所へ移動
          </button>
          {aiSettings.enabled && (
            <button
              onClick={handleLookup}
              disabled={isLoading}
              className="px-2 py-1 text-xs rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:opacity-50"
            >
              {isLoading ? '調べ中...' : 'AIで調べる'}
            </button>
          )}
          {response && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
            >
              {isExpanded ? '閉じる' : '回答を見る'}
            </button>
          )}
        </div>
      </div>

      {/* AI回答 */}
      {isExpanded && (response || error || isLoading) && (
        <div className="px-3 pb-3">
          {isLoading && (
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>考え中...</span>
            </div>
          )}
          {error && (
            <div className="p-2 rounded bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
          {response && (
            <div className="p-2 rounded bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
              <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {response}
              </p>
              <button
                onClick={clearResponse}
                className="mt-2 text-xs text-purple-600 dark:text-purple-400 hover:underline"
              >
                回答をクリア
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
