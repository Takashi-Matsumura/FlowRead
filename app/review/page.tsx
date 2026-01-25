'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MarkedWord, MarkType } from '@/lib/types';
import { FlowReadIcon } from '@/components/ui/FlowReadIcon';
import { builtInMaterials } from '@/data/sample-materials/north-wind-and-sun';
import { getUserMaterials } from '@/lib/storage/materials';
import { updateMarkedWordType } from '@/lib/storage/marked-words';
import { useSettings } from '@/lib/hooks/useSettings';
import { useLlamaAI } from '@/lib/hooks/useLlamaAI';

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

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type ReviewMode = 'all' | 'new' | 'forgotten' | 'mastered';

export default function ReviewPage() {
  const { settings, isLoaded: settingsLoaded } = useSettings();
  const { askAI, isLoading: aiLoading } = useLlamaAI(settings.ai);

  const [words, setWords] = useState<WordWithContext[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContext, setShowContext] = useState(false);
  const [reviewMode, setReviewMode] = useState<ReviewMode>('all');
  const [isComplete, setIsComplete] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // AI関連
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(false);

  // 単語数のカウント
  const [counts, setCounts] = useState({ all: 0, new: 0, forgotten: 0, mastered: 0 });

  const updateCounts = useCallback(() => {
    const allWords = getAllMarkedWordsWithContext();
    setCounts({
      all: allWords.length,
      new: allWords.filter(w => w.type === 'new').length,
      forgotten: allWords.filter(w => w.type === 'forgotten').length,
      mastered: allWords.filter(w => w.type === 'mastered').length,
    });
  }, []);

  const loadWords = useCallback(() => {
    const allWords = getAllMarkedWordsWithContext();
    let filtered = allWords;

    if (reviewMode === 'new') {
      filtered = allWords.filter(w => w.type === 'new');
    } else if (reviewMode === 'forgotten') {
      filtered = allWords.filter(w => w.type === 'forgotten');
    } else if (reviewMode === 'mastered') {
      filtered = allWords.filter(w => w.type === 'mastered');
    }

    setWords(shuffleArray(filtered));
    setCurrentIndex(0);
    setShowContext(false);
    setShowAI(false);
    setAiResponse(null);
    setIsComplete(false);
    updateCounts();
  }, [reviewMode, updateCounts]);

  useEffect(() => {
    setIsHydrated(true);
    loadWords();
  }, [loadWords]);

  const currentWord = words[currentIndex];

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowContext(false);
      setShowAI(false);
      setAiResponse(null);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowContext(false);
      setShowAI(false);
      setAiResponse(null);
    }
  };

  const handleRestart = () => {
    loadWords();
  };

  const handleMarkAs = (newType: MarkType) => {
    if (!currentWord) return;

    updateMarkedWordType(currentWord.materialId, currentWord.word, newType);

    // ローカルのwordsも更新
    setWords(prev =>
      prev.map((w, i) =>
        i === currentIndex ? { ...w, type: newType } : w
      )
    );
    updateCounts();
  };

  const handleAskAI = async () => {
    if (!currentWord || !settings.ai.enabled) return;

    setShowAI(true);
    setAiResponse(null);

    try {
      const prompt = `「${currentWord.word}」という単語について、以下の文脈での意味やニュアンスを教えてください。

文脈: "${currentWord.context}"

この単語がこの文脈でどのような意味の流れを作っているか、英語の語順のまま理解できるように説明してください。`;

      const response = await askAI(prompt);
      setAiResponse(response);
    } catch (error) {
      setAiResponse('AIからの回答を取得できませんでした。');
      console.error('AI error:', error);
    }
  };

  const getTypeLabel = (type: MarkType) => {
    switch (type) {
      case 'new': return '知らなかった';
      case 'forgotten': return '忘れた';
      case 'mastered': return '覚えた';
    }
  };

  const getTypeColor = (type: MarkType) => {
    switch (type) {
      case 'new': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'forgotten': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      case 'mastered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    }
  };

  if (!isHydrated || !settingsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

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
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setReviewMode('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              reviewMode === 'all'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            すべて ({counts.all})
          </button>
          <button
            onClick={() => setReviewMode('new')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              reviewMode === 'new'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            知らなかった ({counts.new})
          </button>
          <button
            onClick={() => setReviewMode('forgotten')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              reviewMode === 'forgotten'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            忘れた ({counts.forgotten})
          </button>
          <button
            onClick={() => setReviewMode('mastered')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              reviewMode === 'mastered'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            覚えた ({counts.mastered})
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
              {reviewMode === 'mastered'
                ? 'まだ覚えた単語がありません'
                : '復習する単語がありません'}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {reviewMode === 'mastered'
                ? '復習で「覚えた」をマークすると、ここに表示されます'
                : '教材を学習して、単語をマークしてください'}
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
                <span className={`inline-block px-2 py-0.5 text-xs rounded mb-4 ${getTypeColor(currentWord.type)}`}>
                  {getTypeLabel(currentWord.type)}
                </span>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {currentWord.word}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentWord.materialTitle}
                </p>
              </div>

              {/* ステータス変更ボタン */}
              <div className="px-6 pb-4 flex justify-center gap-2">
                {currentWord.type !== 'mastered' && (
                  <button
                    onClick={() => handleMarkAs('mastered')}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                  >
                    覚えた
                  </button>
                )}
                {currentWord.type === 'mastered' && (
                  <>
                    <button
                      onClick={() => handleMarkAs('new')}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      知らなかった
                    </button>
                    <button
                      onClick={() => handleMarkAs('forgotten')}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                    >
                      忘れた
                    </button>
                  </>
                )}
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

              {/* AIサポート */}
              {settings.ai.enabled && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  {showAI ? (
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20">
                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 8V4H8"/>
                          <rect width="16" height="12" x="4" y="8" rx="2"/>
                          <path d="M2 14h2"/>
                          <path d="M20 14h2"/>
                          <path d="M15 13v2"/>
                          <path d="M9 13v2"/>
                        </svg>
                        AIサポート
                      </p>
                      {aiLoading ? (
                        <div className="flex items-center gap-2 text-gray-500">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          AIが考えています...
                        </div>
                      ) : aiResponse ? (
                        <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                          {aiResponse}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <button
                      onClick={handleAskAI}
                      className="w-full p-4 text-center text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 8V4H8"/>
                        <rect width="16" height="12" x="4" y="8" rx="2"/>
                        <path d="M2 14h2"/>
                        <path d="M20 14h2"/>
                        <path d="M15 13v2"/>
                        <path d="M9 13v2"/>
                      </svg>
                      AIで調べる
                    </button>
                  )}
                </div>
              )}
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
