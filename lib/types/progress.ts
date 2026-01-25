// 教材ごとの学習進捗
export interface LearningProgress {
  materialId: string;
  currentSentenceIndex: number;    // 現在の文インデックス
  completedSentences: string[];    // 完了した文のID配列
  lastAccessedAt: number;          // 最終アクセス日時
}

// ユーザー全体の進捗
export interface UserProgress {
  materials: Record<string, LearningProgress>;
}

// マークの種類
// new: 知らなかった（初めて見た単語）
// forgotten: 忘れてしまった（見たことがあるが思い出せない）
// mastered: 覚えた（復習で克服した）
export type MarkType = 'new' | 'forgotten' | 'mastered';

// マークした単語
export interface MarkedWord {
  word: string;
  sentenceIndex: number;
  chunkIndex: number;
  type: MarkType;
}
