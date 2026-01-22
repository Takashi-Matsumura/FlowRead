'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { Material } from '@/lib/types';
import { getChunkColorClasses } from '@/lib/utils/chunk-colors';

interface MarkedWord {
  word: string;
  sentenceIndex: number;
  chunkIndex: number;
}

interface FlowDisplayProps {
  material: Material;
  currentSentenceIndex: number;
  currentChunkIndex: number;
  onPositionChange: (sentenceIndex: number, chunkIndex: number) => void;
  markedWords: MarkedWord[];
  onMarkWord: (word: MarkedWord) => void;
  onUnmarkWord: (word: string) => void;
}

export function FlowDisplay({
  material,
  currentSentenceIndex,
  currentChunkIndex,
  onPositionChange,
  markedWords,
  onMarkWord,
  onUnmarkWord,
}: FlowDisplayProps) {
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ word: string; x: number; y: number; sIndex: number; cIndex: number } | null>(null);
  const activeChunkRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSentence = material.sentences[currentSentenceIndex];
  const currentChunk = currentSentence?.chunks[currentChunkIndex];

  // ツールチップ位置の更新
  useEffect(() => {
    if (activeChunkRef.current && containerRef.current) {
      const chunkRect = activeChunkRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      setTooltipPosition({
        top: chunkRect.bottom - containerRect.top + 8,
        left: chunkRect.left - containerRect.left + chunkRect.width / 2,
      });
    }
  }, [currentSentenceIndex, currentChunkIndex]);

  // コンテキストメニューを閉じる
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // 次のチャンク/文へ移動
  const goToNext = useCallback(() => {
    const sentence = material.sentences[currentSentenceIndex];
    if (currentChunkIndex < sentence.chunks.length - 1) {
      onPositionChange(currentSentenceIndex, currentChunkIndex + 1);
    } else if (currentSentenceIndex < material.sentences.length - 1) {
      onPositionChange(currentSentenceIndex + 1, 0);
    }
  }, [material, currentSentenceIndex, currentChunkIndex, onPositionChange]);

  // 前のチャンク/文へ移動
  const goToPrev = useCallback(() => {
    if (currentChunkIndex > 0) {
      onPositionChange(currentSentenceIndex, currentChunkIndex - 1);
    } else if (currentSentenceIndex > 0) {
      const prevSentence = material.sentences[currentSentenceIndex - 1];
      onPositionChange(currentSentenceIndex - 1, prevSentence.chunks.length - 1);
    }
  }, [material, currentSentenceIndex, currentChunkIndex, onPositionChange]);

  // キーボード操作
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  // 単語の右クリック処理
  const handleWordContextMenu = (e: React.MouseEvent, word: string, sIndex: number, cIndex: number) => {
    e.preventDefault();
    // 句読点を除去
    const cleanWord = word.replace(/[.,;:!?'"]/g, '').toLowerCase();
    if (cleanWord.length > 0) {
      setContextMenu({
        word: cleanWord,
        x: e.clientX,
        y: e.clientY,
        sIndex,
        cIndex,
      });
    }
  };

  // 単語がマーク済みかチェック
  const isWordMarked = (word: string) => {
    const cleanWord = word.replace(/[.,;:!?'"]/g, '').toLowerCase();
    return markedWords.some(m => m.word === cleanWord);
  };

  const colorClasses = currentChunk ? getChunkColorClasses(currentChunk.guide.role) : '';

  return (
    <div ref={containerRef} className="relative">
      {/* 全文表示（連続した文章） */}
      <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-xl leading-loose text-gray-900 dark:text-gray-100">
          {material.sentences.map((sentence, sIndex) => (
            <span key={sentence.id}>
              {sentence.chunks.map((chunk, cIndex) => {
                const isActive = sIndex === currentSentenceIndex && cIndex === currentChunkIndex;
                const isPast =
                  sIndex < currentSentenceIndex ||
                  (sIndex === currentSentenceIndex && cIndex < currentChunkIndex);

                // チャンク内の単語を個別に処理
                const words = chunk.text.split(/(\s+)/);
                const isLastChunk = cIndex === sentence.chunks.length - 1;

                return (
                  <span key={chunk.id}>
                    <span
                      ref={isActive ? activeChunkRef : null}
                      onClick={() => onPositionChange(sIndex, cIndex)}
                      className={`
                        cursor-pointer transition-all duration-200 rounded
                        ${isActive
                          ? 'bg-yellow-200 dark:bg-yellow-600/50 border-b-2 border-yellow-500'
                          : isPast
                            ? 'text-gray-400 dark:text-gray-500'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      {words.map((word, wIndex) => {
                        const isMarked = isWordMarked(word);
                        return (
                          <span
                            key={wIndex}
                            onContextMenu={(e) => handleWordContextMenu(e, word, sIndex, cIndex)}
                            className={isMarked ? 'bg-red-200 dark:bg-red-700/50 rounded px-0.5' : ''}
                          >
                            {word}
                          </span>
                        );
                      })}
                    </span>
                    {/* チャンク間にスペースを入れる（最後のチャンク以外） */}
                    {!isLastChunk && ' '}
                  </span>
                );
              })}
              {/* 文の間にスペースを入れる（最後の文以外） */}
              {sIndex < material.sentences.length - 1 && ' '}
            </span>
          ))}
        </div>
      </div>

      {/* 右クリックコンテキストメニュー */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-40"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            "{contextMenu.word}"
          </div>
          {markedWords.some(m => m.word === contextMenu.word) ? (
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
              onClick={() => {
                onUnmarkWord(contextMenu.word);
                setContextMenu(null);
              }}
            >
              マークを解除
            </button>
          ) : (
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                onMarkWord({
                  word: contextMenu.word,
                  sentenceIndex: contextMenu.sIndex,
                  chunkIndex: contextMenu.cIndex,
                });
                setContextMenu(null);
              }}
            >
              わからない単語としてマーク
            </button>
          )}
        </div>
      )}

      {/* 吹き出しツールチップ */}
      {currentChunk && tooltipPosition && (
        <div
          className="absolute z-10 transition-all duration-200"
          style={{
            top: tooltipPosition.top,
            left: Math.max(150, Math.min(tooltipPosition.left, (containerRef.current?.clientWidth || 600) - 150)),
            transform: 'translateX(-50%)',
          }}
        >
          {/* 吹き出しの三角形 */}
          <div className="relative flex justify-center">
            <div
              className={`w-0 h-0
                border-l-8 border-r-8 border-b-8
                border-l-transparent border-r-transparent
                ${currentChunk.guide.role === 'subject' ? 'border-b-blue-200 dark:border-b-blue-800' :
                  currentChunk.guide.role === 'verb' ? 'border-b-green-200 dark:border-b-green-800' :
                  currentChunk.guide.role === 'object' ? 'border-b-amber-200 dark:border-b-amber-800' :
                  'border-b-gray-200 dark:border-b-gray-700'
                }`}
            />
          </div>

          {/* 吹き出し本体 */}
          <div className={`rounded-xl border-2 p-4 shadow-lg min-w-64 max-w-sm ${colorClasses}`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/50 dark:bg-black/20 flex items-center justify-center text-sm font-bold">
                {currentChunkIndex + 1}
              </div>

              <div className="flex-1">
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {currentChunk.text}
                </p>

                <div className="mt-2 space-y-1">
                  {currentChunk.guide.questionForm && (
                    <p className="text-sm font-bold">
                      {currentChunk.guide.questionForm}
                    </p>
                  )}
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {currentChunk.guide.flowHint}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* チャンク移動コントロール */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={goToPrev}
          disabled={currentSentenceIndex === 0 && currentChunkIndex === 0}
          className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="前へ"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          {currentSentenceIndex + 1}文目 / {currentChunkIndex + 1}番目
        </div>

        <button
          onClick={goToNext}
          disabled={
            currentSentenceIndex === material.sentences.length - 1 &&
            currentChunkIndex === material.sentences[currentSentenceIndex].chunks.length - 1
          }
          className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="次へ"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* キーボードヒント */}
      <p className="mt-4 text-center text-sm text-gray-400 dark:text-gray-500">
        ← → キーで移動 / 右クリックで単語をマーク
      </p>
    </div>
  );
}
