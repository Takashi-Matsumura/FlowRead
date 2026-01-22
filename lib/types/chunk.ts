// チャンクの文法的役割
export type ChunkRole =
  | 'subject'    // 主語 - 「誰が」
  | 'verb'       // 動詞 - 「どうする」
  | 'object'     // 目的語 - 「何を」
  | 'complement' // 補語 - 「どんな」
  | 'modifier'   // 修飾語 - 「どのように」
  | 'time'       // 時 - 「いつ」
  | 'place'      // 場所 - 「どこで」
  | 'reason'     // 理由 - 「なぜ」
  | 'condition'  // 条件 - 「もし」
  | 'connector'  // 接続 - 「そして」「しかし」
  | 'intro';     // 導入 - 文頭の副詞句など

// 意味の流れガイド（翻訳ではない）
export interface FlowGuide {
  role: ChunkRole;       // 文法的役割
  questionForm: string;  // 問いかけ形式（例: "誰が？"）
  flowHint: string;      // 流れのヒント（例: "話の主役が登場"）
}

// チャンク（意味のかたまり）
export interface Chunk {
  id: string;
  text: string;       // 英文テキスト
  order: number;      // チャンク内の順番
  guide: FlowGuide;   // 意味の流れガイド
}
