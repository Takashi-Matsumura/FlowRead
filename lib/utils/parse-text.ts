import { Material, Sentence, Chunk } from '../types';

// 英文テキストを文に分割
function splitIntoSentences(text: string): string[] {
  // ピリオド、疑問符、感嘆符で分割（引用符内は考慮）
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  return sentences;
}

// 文を簡易チャンクに分割（シンプル版：文全体を1チャンクとして扱う）
function createSimpleChunks(sentenceText: string, sentenceId: string): Chunk[] {
  return [
    {
      id: `${sentenceId}-chunk-1`,
      text: sentenceText,
      order: 1,
      guide: {
        role: 'subject',
        questionForm: '意味は？',
        flowHint: '文全体の意味を捉えよう',
      },
    },
  ];
}

// テキストからMaterialを生成
export function createMaterialFromText(
  title: string,
  text: string,
  description?: string
): Material {
  const now = Date.now();
  const materialId = `user-${now}`;

  const sentenceTexts = splitIntoSentences(text);

  const sentences: Sentence[] = sentenceTexts.map((sentenceText, index) => {
    const sentenceId = `${materialId}-sentence-${index + 1}`;
    return {
      id: sentenceId,
      originalText: sentenceText,
      order: index + 1,
      chunks: createSimpleChunks(sentenceText, sentenceId),
    };
  });

  return {
    id: materialId,
    title,
    description,
    isBuiltIn: false,
    createdAt: now,
    updatedAt: now,
    sentences,
  };
}
