'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MarkedWord } from '@/lib/types';
import { FlowReadIcon } from '@/components/ui/FlowReadIcon';
import { builtInMaterials } from '@/data/sample-materials/north-wind-and-sun';
import { getUserMaterials } from '@/lib/storage/materials';

interface WordWithContext extends MarkedWord {
  materialId: string;
  materialTitle: string;
  context: string;
}

const MARKED_WORDS_PREFIX = 'flowread_marked_words_';

function getAllMarkedWordsWithContext(): WordWithContext[] {
  if (typeof window === 'undefined') return [];

  const allMaterials = [...builtInMaterials, ...getUserMaterials()];
  const result: WordWithContext[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(MARKED_WORDS_PREFIX)) {
      const materialId = key.replace(MARKED_WORDS_PREFIX, '');
      const material = allMaterials.find(m => m.id === materialId);
      if (!material) continue;

      try {
        const data = localStorage.getItem(key);
        if (data) {
          const words: MarkedWord[] = JSON.parse(data);
          words.forEach(word => {
            // コンテキストを取得
            const sentence = material.sentences[word.sentenceIndex];
            const context = sentence?.originalText || '';

            result.push({
              ...word,
              materialId,
              materialTitle: material.title,
              context,
            });
          });
        }
      } catch (e) {
        console.error('Failed to parse marked words:', e);
      }
    }
  }

  return result;
}

// シャッフル関数
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function ReviewPage() {
  const [words, setWords] = useState<WordWithContext[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContext, setShowContext] = useState(false);
  const [reviewMode, setReviewMode] = useState<'all' | 'new' | 'forgotten'>('all');
  const [isComplete, setIsComplete] = useState(false);

  const loadWords = useCallback(() => {
    const allWords = getAllMarkedWordsWithContext();
    let filtered = allWords;

    if (reviewMode === 'new') {
      filtered = allWords.filter(w => w.type === 'new');
    } else if (reviewMode === 'forgotten') {
      filtered = allWords.filter(w => w.type === 'forgotten');
    }

    setWords(shuffleArray(filtered));
    setCurrentIndex(0);
    setShowContext(false);
    setIsComplete(false);
  }, [reviewMode]);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  const currentWord = words[currentIndex];

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowContext(false);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowContext(false);
    }
  };

  const handleRestart = () => {
    loadWords();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
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
            <div className="flex items-center gap-2">
              <FlowReadIcon size={24} />
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                復習
              </h1>
            </div>
          </div>
          {words.length > 0 && !isComplete && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentIndex + 1} / {words.length}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* フィルター */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setReviewMode('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              reviewMode === 'all'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            すべて ({getAllMarkedWordsWithContext().length})
          </button>
          <button
            onClick={() => setReviewMode('new')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              reviewMode === 'new'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            知らなかった
          </button>
          <button
            onClick={() => setReviewMode('forgotten')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              reviewMode === 'forgotten'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            忘れた
          </button>
        </div>

        {words.length === 0 ? (
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
            </svg>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              復習する単語がありません
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              教材を学習して、単語をマークしてください
            </p>
          </div>
        ) : isComplete ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
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
                className="text-green-600 dark:text-green-400"
              >
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              復習完了！
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {words.length} 単語を復習しました
            </p>
            <button
              onClick={handleRestart}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              もう一度
            </button>
          </div>
        ) : currentWord && (
          <>
            {/* フラッシュカード */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* 単語 */}
              <div className="p-8 text-center">
                <span
                  className={`inline-block px-2 py-0.5 text-xs rounded mb-4 ${
                    currentWord.type === 'new'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                  }`}
                >
                  {currentWord.type === 'new' ? '知らなかった' : '忘れた'}
                </span>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {currentWord.word}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentWord.materialTitle}
                </p>
              </div>

              {/* コンテキスト表示 */}
              <div className="border-t border-gray-200 dark:border-gray-700">
                {showContext ? (
                  <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      文脈:
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {currentWord.context.split(new RegExp(`(${currentWord.word})`, 'gi')).map((part, i) =>
                        part.toLowerCase() === currentWord.word.toLowerCase() ? (
                          <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">
                            {part}
                          </mark>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowContext(true)}
                    className="w-full p-4 text-center text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    文脈を見る
                  </button>
                )}
              </div>
            </div>

            {/* ナビゲーション */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                前へ
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentIndex < words.length - 1 ? '次へ' : '完了'}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>

            {/* プログレスバー */}
            <div className="mt-6 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
