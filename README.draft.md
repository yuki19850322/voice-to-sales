# お客様の声 → セールス文変換

**口コミ・レビューを貼るだけで、3種類のセールス文を自動生成するマイクロSaaS**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Claude](https://img.shields.io/badge/Claude-3.5_Sonnet-purple)](https://www.anthropic.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## このツールは何？

「良いレビューやお客様の声はあるのに、セールス文に活かせていない…」

そんな日本語圏の営業マン・個人事業主・コーチ・講師のための実用ツールです。

入力するのはたった3つ：
- お客様の声・口コミ（テキスト）
- 商品・サービス名
- 使いたい媒体（LP / SNS投稿 / メルマガ）

AI（Claude）が即座に以下の3パターンを生成します：

| パターン | 用途 | 特徴 |
|----------|------|------|
| **ビフォーアフター型** | LP・セールスレター | 購入前の悩み → 購入後の変化を強調 |
| **ストーリー型** | ブログ・メルマガ・note | お客様の体験を物語形式で再構成 |
| **一言キャッチコピー** | SNS見出し・プロフィール | 30文字以内の短い刺さる一文 |

---

## ライブデモ

（Vercelデプロイ後、ここにリンクを記載予定）

現在はローカルで簡単に起動できます（下記「クイックスタート」参照）。

---

## クイックスタート

### 1. リポジトリをクローン

```bash
git clone https://github.com/yuki19850322/voice-to-sales.git
cd voice-to-sales
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. Anthropic APIキーを設定

```bash
cp .env.example .env.local
```

`.env.local` を開いて、[Anthropic Console](https://console.anthropic.com/) で取得したAPIキーを貼り付けます：

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

---

## 使い方

1. 「お客様の声・口コミ」欄に実際のレビューや感想を貼り付け
2. 商品・サービス名を入力
3. 使いたい媒体を選択（LP / SNS投稿 / メルマガ）
4. 「変換する」ボタンをクリック
5. 生成された3種類のセールス文をコピーボタンで即コピー

**1日3回まで無料**でご利用いただけます（ブラウザのlocalStorageで管理）。

---

## 技術スタック

- **フロントエンド**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4
- **AI**: Anthropic Claude 3.5 Sonnet (`claude-3-5-sonnet-20241022`)
- **デプロイ**: Vercel（予定）
- **状態管理**: なし（完全ステートレス + localStorageのみ）

DBや認証は一切使っていません。最小構成で「今すぐ動く」ことを最優先にしています。

---

## AIで作った経緯（このプロジェクトの最大の特徴）

このツールは「AIをフル活用した急速マイクロSaaS開発」の実例として作られました。

### 開発のタイムライン

1. **アイデア選定**
   - 90個のマイクロSaaSアイデアから、個人事業主の深いペインと実現性を評価して選定（`ideas.md` / `おすすめベスト5.md`）

2. **設計書をAIで自動生成**
   - Claude Code に「MVP設計書を作って」と依頼
   - `mvp-designs.md` に技術スタック、画面構成、プロンプト設計、開発3日プランまで詳細に書き出された

3. **実装は1コミットでここまで**
   - フォーム + Claude API接続 + 3パターン出力 + コピーボタン + 1日3回制限 +  polished UI
   - すべてを1つのコミット（"Initial commit: voice-to-sales MVP"）で完了

4. **Grok Buildで再開・OSS化**
   - 久しぶりの再開時に本リポジトリをGrok Buildで分析
   - OpenAI Codex for Open Source 申請向けにドキュメントと完成度を大幅に引き上げ（本README含む）

### プロンプトエンジニアリングのポイント

APIルート（`app/api/convert/route.ts`）では以下の工夫をしています：

- 媒体ごとに最適な文体・文字数をシステムプロンプトで明示的に指示
- 「必ずJSON形式のみで返してください。マークダウンやコードブロックは使用しない」と厳格に指示
- レスポンスから正規表現でJSONを抽出するフォールバックを実装（Claudeがたまに前後に説明文を付けてくる対策）
- エラーハンドリングで rate limit / 認証エラーを日本語でユーザーに伝える

これにより、安定してパース可能な3パターン出力が得られます。

---

## 制限事項と正直な話

- **利用制限**: 現在はブラウザのlocalStorageで1日3回に制限しています（簡単に解除可能）。本番サービスにする場合はサーバー側での制限実装が必要です。
- **課金機能**: 元の設計書（`mvp-designs.md`）ではStripe月額課金を想定していましたが、本バージョンでは未実装です。OSSとしての学習・ショーケース用途を優先しました。
- **APIコスト**: Claude呼び出し1回あたり数十〜数百トークン程度。個人レベルでの運用コストは非常に低いです。
- **日本語特化**: ターゲットを明確にするため、UI・出力ともに日本語のみです。

---

## 開発

```bash
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド（成功確認済み）
npm run lint     # ESLint
```

### プロジェクト構成（意図的にシンプルに保っています）

```
app/
├── api/convert/route.ts   # Claude呼び出し＋JSONパース
├── layout.tsx
├── page.tsx               # メインUI（すべてここに集約）
└── globals.css
```

「AIで短期間で実用的なものを届ける」ことを体現するため、意図的に1ファイル中心のMVP構造にしています。必要に応じて後から分割可能です。

---

## 貢献

IssueやPull Requestを歓迎します！

特に以下のような貢献を嬉しいです：
- プロンプトの改善提案
- UI/UXの磨き
- より良いエラーハンドリング
- ドキュメントの改善

本プロジェクト自体が「AI（Claude + Grok Build）で作られた」ものであることを念頭に、AIツールの活用も大歓迎です。

---

## ライセンス

MIT License

詳細は [LICENSE](LICENSE) ファイルをご覧ください。

---

## 関連ドキュメント

- [アイデア90選 (ideas.md)](https://github.com/yuki19850322/voice-to-sales/blob/main/../ideas.md) — 元となったアイデア群
- [MVP設計書 (mvp-designs.md)](https://github.com/yuki19850322/voice-to-sales/blob/main/../mvp-designs.md) — Claudeが自動生成した設計書
- [開発ログ (saas-project-log/)](https://github.com/yuki19850322/voice-to-sales/blob/main/../saas-project-log/) — 選定過程とロードマップ

---

**「AIの力で、1人で本気で動くプロダクトを最速で届ける」**

その実例として、このvoice-to-salesを公開します。

ご質問・ご感想はGitHubのIssueまでお気軽にどうぞ。
