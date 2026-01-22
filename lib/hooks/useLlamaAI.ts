'use client';

import { useState, useCallback } from 'react';
import { AISettings } from '../types/settings';

interface LlamaResponse {
  content: string;
}

interface UseLlamaAIReturn {
  isLoading: boolean;
  error: string | null;
  response: string | null;
  askAI: (prompt: string) => Promise<string | null>;
  clearResponse: () => void;
}

export function useLlamaAI(settings: AISettings): UseLlamaAIReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const askAI = useCallback(async (prompt: string): Promise<string | null> => {
    if (!settings.enabled) {
      setError('AI機能が無効です。設定で有効にしてください。');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      // llama.cpp server API (OpenAI互換)
      const res = await fetch(`${settings.endpoint}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `あなたは英語学習をサポートするアシスタントです。
英語を日本語に翻訳するのではなく、英語を「意味の流れ」として理解する手助けをしてください。
- 直接的な日本語訳は避けてください
- 英語の語順のまま、意味がどう展開するかを説明してください
- 文法用語は最小限に、感覚的な理解を促してください
回答は簡潔に、2-3文程度でお願いします。`,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: settings.temperature,
          max_tokens: settings.maxTokens,
          stream: false,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';

      setResponse(content);
      return content;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'AI接続エラー';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  const clearResponse = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    response,
    askAI,
    clearResponse,
  };
}
