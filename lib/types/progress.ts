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
