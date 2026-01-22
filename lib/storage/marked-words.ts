import { MarkedWord } from '../types/progress';

const STORAGE_KEY_PREFIX = 'flowread_marked_words_';

// 教材IDごとにマークした単語を取得
export function getMarkedWords(materialId: string): MarkedWord[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY_PREFIX + materialId);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load marked words:', e);
  }

  return [];
}

// 教材IDごとにマークした単語を保存
export function saveMarkedWords(materialId: string, words: MarkedWord[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + materialId, JSON.stringify(words));
  } catch (e) {
    console.error('Failed to save marked words:', e);
  }
}

// 教材IDごとにマークした単語を削除
export function clearMarkedWords(materialId: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY_PREFIX + materialId);
  } catch (e) {
    console.error('Failed to clear marked words:', e);
  }
}
