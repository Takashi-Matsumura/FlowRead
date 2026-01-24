import { MarkedWord } from '../types/progress';
import { Material } from '../types/material';
import { AppSettings } from '../types/settings';
import { getSettings } from './settings';
import { getUserMaterials, saveUserMaterials } from './materials';

const MARKED_WORDS_PREFIX = 'flowread_marked_words_';
const DEFAULT_FILENAME = 'flowread-backup.json';

export interface BackupData {
  version: 1;
  exportedAt: string;
  markedWords: Record<string, MarkedWord[]>;
  userMaterials: Material[];
  settings: AppSettings;
}

// 全てのマークした単語を取得
function getAllMarkedWords(): Record<string, MarkedWord[]> {
  const result: Record<string, MarkedWord[]> = {};

  if (typeof window === 'undefined') return result;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(MARKED_WORDS_PREFIX)) {
      const materialId = key.replace(MARKED_WORDS_PREFIX, '');
      try {
        const data = localStorage.getItem(key);
        if (data) {
          result[materialId] = JSON.parse(data);
        }
      } catch (e) {
        console.error('Failed to parse marked words:', e);
      }
    }
  }

  return result;
}

// 全てのマークした単語を保存
function setAllMarkedWords(markedWords: Record<string, MarkedWord[]>): void {
  if (typeof window === 'undefined') return;

  // 既存のマークした単語をクリア
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(MARKED_WORDS_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));

  // 新しいデータを保存
  for (const [materialId, words] of Object.entries(markedWords)) {
    localStorage.setItem(MARKED_WORDS_PREFIX + materialId, JSON.stringify(words));
  }
}

// バックアップデータを作成
export function createBackup(): BackupData {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    markedWords: getAllMarkedWords(),
    userMaterials: getUserMaterials(),
    settings: getSettings(),
  };
}

// バックアップをエクスポート（ダウンロード）
export function exportBackup(): void {
  const data = createBackup();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = DEFAULT_FILENAME;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// バックアップデータを検証
export function validateBackup(data: unknown): data is BackupData {
  if (!data || typeof data !== 'object') return false;

  const backup = data as Record<string, unknown>;

  if (backup.version !== 1) return false;
  if (typeof backup.exportedAt !== 'string') return false;
  if (!backup.markedWords || typeof backup.markedWords !== 'object') return false;
  if (!Array.isArray(backup.userMaterials)) return false;
  if (!backup.settings || typeof backup.settings !== 'object') return false;

  return true;
}

// バックアップをインポート
export function importBackup(data: BackupData): { success: boolean; message: string } {
  try {
    // マークした単語を復元
    setAllMarkedWords(data.markedWords);

    // ユーザー教材を復元（既存とマージ）
    const existingMaterials = getUserMaterials();
    const newMaterials = data.userMaterials.filter(
      (m) => !existingMaterials.some((e) => e.id === m.id)
    );
    saveUserMaterials([...existingMaterials, ...newMaterials]);

    // 設定を復元
    localStorage.setItem('flowread_settings', JSON.stringify(data.settings));

    const stats = {
      words: Object.values(data.markedWords).reduce((acc, arr) => acc + arr.length, 0),
      materials: newMaterials.length,
    };

    return {
      success: true,
      message: `インポート完了: ${stats.words}個の単語、${stats.materials}個の新規教材`,
    };
  } catch (e) {
    console.error('Failed to import backup:', e);
    return {
      success: false,
      message: 'インポートに失敗しました',
    };
  }
}

// ファイルからバックアップを読み込み
export function readBackupFile(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        if (!validateBackup(data)) {
          reject(new Error('無効なバックアップファイルです'));
          return;
        }

        resolve(data);
      } catch {
        reject(new Error('ファイルの読み込みに失敗しました'));
      }
    };

    reader.onerror = () => {
      reject(new Error('ファイルの読み込みに失敗しました'));
    };

    reader.readAsText(file);
  });
}
