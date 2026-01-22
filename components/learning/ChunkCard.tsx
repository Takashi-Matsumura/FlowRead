'use client';

import { Chunk } from '@/lib/types';
import { getChunkColorClasses } from '@/lib/utils/chunk-colors';

interface ChunkCardProps {
  chunk: Chunk;
  animationDelay?: number;
}

export function ChunkCard({ chunk, animationDelay = 0 }: ChunkCardProps) {
  const colorClasses = getChunkColorClasses(chunk.guide.role);

  return (
    <div
      className={`rounded-lg border-2 p-4 transition-all duration-300 ${colorClasses}`}
      style={{
        animationDelay: `${animationDelay}ms`,
        animation: 'chunk-appear 0.4s ease-out forwards',
        opacity: 0,
      }}
    >
      {/* 英文テキスト */}
      <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
        {chunk.text}
      </p>

      {/* 役割ラベル（問いかけ形式） */}
      {chunk.guide.questionForm && (
        <p className="mt-2 text-sm font-semibold">
          {chunk.guide.questionForm}
        </p>
      )}

      {/* フローヒント */}
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {chunk.guide.flowHint}
      </p>
    </div>
  );
}
