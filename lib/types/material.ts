import { Chunk } from './chunk';

// 文
export interface Sentence {
  id: string;
  originalText: string;  // 原文
  chunks: Chunk[];       // チャンクの配列
  order: number;         // 文の順番
}

// 教材
export interface Material {
  id: string;
  title: string;
  description?: string;  // 説明（任意）
  source?: string;       // 出典（任意）
  sentences: Sentence[];
  createdAt: number;
  updatedAt: number;
  isBuiltIn: boolean;    // 組み込み教材かどうか
}
