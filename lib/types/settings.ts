// AI設定
export interface AISettings {
  enabled: boolean;
  endpoint: string;       // llama.cpp server endpoint (e.g., "http://localhost:8080")
  model: string;          // モデル名（表示用）
  temperature: number;    // 生成の多様性 (0.0-1.0)
  maxTokens: number;      // 最大トークン数
}

// アプリ全体の設定
export interface AppSettings {
  ai: AISettings;
}

// デフォルト設定
export const defaultSettings: AppSettings = {
  ai: {
    enabled: false,
    endpoint: 'http://localhost:8080',
    model: 'llama.cpp',
    temperature: 0.7,
    maxTokens: 256,
  },
};
