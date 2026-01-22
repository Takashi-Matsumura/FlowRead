// AIプロバイダーの種類
export type AIProvider = 'llama.cpp' | 'lm-studio' | 'ollama';

// プロバイダーごとの設定情報
export const providerConfigs: Record<AIProvider, {
  name: string;
  defaultEndpoint: string;
  description: string;
}> = {
  'llama.cpp': {
    name: 'llama.cpp',
    defaultEndpoint: 'http://localhost:8080',
    description: 'llama.cpp server（軽量・高速）',
  },
  'lm-studio': {
    name: 'LM Studio',
    defaultEndpoint: 'http://localhost:1234',
    description: 'LM Studio（GUIで簡単にモデル管理）',
  },
  'ollama': {
    name: 'Ollama',
    defaultEndpoint: 'http://localhost:11434',
    description: 'Ollama（コマンドラインで簡単セットアップ）',
  },
};

// AI設定
export interface AISettings {
  enabled: boolean;
  provider: AIProvider;   // AIプロバイダーの種類
  endpoint: string;       // サーバーエンドポイント
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
    provider: 'llama.cpp',
    endpoint: 'http://localhost:8080',
    model: 'llama.cpp',
    temperature: 0.7,
    maxTokens: 256,
  },
};
