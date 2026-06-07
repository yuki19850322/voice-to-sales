# Contributing to voice-to-sales

このプロジェクトに貢献していただきありがとうございます！

## 開発環境のセットアップ

```bash
git clone https://github.com/yuki19850322/voice-to-sales.git
cd voice-to-sales

npm install

# 環境変数の準備
cp .env.example .env.local
# .env.local を編集して Anthropic API キーを設定してください
# ANTHROPIC_API_KEY=sk-ant-...

npm run dev
```

ブラウザで http://localhost:3000 を開くとすぐに使えます。

## コントリビュートの流れ

1. Issue を立てる（バグ報告・機能提案）
2. 必要に応じてブランチを作成して作業
3. Pull Request を送る

## 注意点

- このプロジェクトは **AI（Claude + Grok Build）** を積極的に活用して開発・ドキュメント整備を行っています。
- AIが生成したコードや文章も歓迎しますが、最終的な品質・一貫性・保守性については人間が責任を持って確認・調整してください。
- 日本語のUI・ドキュメントを優先しています。英語対応が必要な場合は事前に相談をお願いします。

## コードのスタイル

- 既存コードの雰囲気に合わせる
- TypeScript を厳密に使用
- Tailwind CSS でスタイリング
- 大きな変更はなるべく小さく分割してPRを送る

## ライセンス

MIT License

---

質問や提案はいつでも Issue や Discussion でお気軽にどうぞ！
