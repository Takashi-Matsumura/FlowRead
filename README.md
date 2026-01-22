# FlowRead

**訳すな。意味の流れで、理解せよ。**

*Don't translate. Understand the flow of meaning.*

---

## Philosophy / 思想

### なぜ「翻訳」ではダメなのか

多くの日本人英語学習者は、英語を読むとき無意識に「日本語に変換」しています。

```
The boy kicked the ball.
→ 「その少年は」「ボールを」「蹴った」
```

この「返り読み」は、英語を「パズル」として解読する行為です。しかし、ネイティブスピーカーは英語を左から右へ、**意味の流れ**として受け取っています。

### FlowReadのアプローチ

FlowReadは英語を「意味のかたまり（チャンク）」に分解し、それぞれに**問いかけ**を添えます。

```
[The North Wind and the Sun]  ← 誰が？ / 物語の主役たちが登場
[were disputing]              ← どうしていた？ / 二人の間で起きていること
[which was the stronger]      ← 何について？ / 議論の中身が見える
```

日本語訳は**一切表示しません**。代わりに、「どう理解すればいいか」のヒントを与えます。

### 目指す読み方

1. **左から右へ流れるように読む** - 返り読みをしない
2. **チャンクごとに意味を感じる** - 単語単位ではなく意味の塊で捉える
3. **問いかけに答える形で理解する** - 「誰が？」「どうした？」に自然に答えられる
4. **翻訳ではなく理解** - 日本語に変換せず、英語のまま意味を受け取る

---

## Features / 機能

### 学習画面

- **全文表示**: 教材の英文を本のように連続表示
- **チャンクハイライト**: 現在注目すべき「意味のかたまり」を黄色でハイライト
- **フローヒント**: 各チャンクの役割と理解のヒントを吹き出しで表示
- **キーボード操作**: ←→キーでチャンクを移動

### 単語マーク機能

- **右クリックでマーク**: わからない単語を右クリックしてマーク
- **赤色ハイライト**: マークした単語は文中で赤く表示
- **サイドパネル**: マークした単語の一覧と文脈を確認
- **AIで調べる**: 品詞、英英定義、文脈での意味をAIが解説

### AIサポート

- **llama.cpp統合**: ローカルLLMを使用したプライベートな学習
- **チャンク解説**: 選択中のチャンクについてAIに質問
- **文全体の流れ**: 文全体の意味の流れをAIが解説
- **単語の詳細**: 英英辞書のような定義と文脈での使い方

---

## Getting Started / はじめかた

### 必要なもの

- Node.js 18+
- npm or yarn
- (オプション) llama.cpp server for AI features

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/your-username/flow-read.git
cd flow-read

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### AI機能を使う場合

1. [llama.cpp](https://github.com/ggerganov/llama.cpp) をセットアップ
2. サーバーモードで起動:
   ```bash
   ./llama-server -m your-model.gguf --port 8080
   ```
3. FlowReadの設定ページ (`/settings`) でAIを有効化

---

## Tech Stack / 技術スタック

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Data**: localStorage
- **AI**: llama.cpp (OpenAI-compatible API)

---

## Sample Material / サンプル教材

初期状態では「北風と太陽」（The North Wind and the Sun）が含まれています。

イソップ寓話より、北風と太陽が旅人の外套を脱がせる競争をする物語です。著作権が切れた古典作品を使用しています。

---

## Roadmap / 今後の予定

- [ ] ユーザーによる教材追加機能
- [ ] 進捗の保存と復元
- [ ] 追加のサンプル教材（ウサギとカメ等）
- [ ] 教材のインポート/エクスポート
- [ ] 学習統計の表示

---

## Contributing / 貢献

Issues and Pull Requests are welcome!

---

## License

MIT

---

## Acknowledgments / 謝辞

- サンプル教材: イソップ寓話「北風と太陽」(The North Wind and the Sun)
- AI: [llama.cpp](https://github.com/ggerganov/llama.cpp) by Georgi Gerganov
