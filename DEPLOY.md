# Vercel デプロイ手順（voice-to-sales）

このプロジェクトは Next.js 16 + Anthropic API を使用しているため、Vercel へのデプロイが最適です。

## ステップバイステップ

### 1. 事前準備
- GitHub リポジトリが最新であること（`git push` 済み）
- Anthropic API キー（`sk-ant-...`）を用意しておく

### 2. Vercel でプロジェクトを作成
1. https://vercel.com にアクセスして GitHub でログイン
2. 「New Project」ボタンをクリック
3. 「Import Git Repository」から `yuki19850322/voice-to-sales` を選択
4. 「Import」をクリック

### 3. 環境変数の設定（重要）
デプロイ設定画面で以下の環境変数を追加してください：

| Name                | Value                          | Environment |
|---------------------|--------------------------------|-------------|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` (あなたのキー) | Production, Preview, Development |

- 「Add」ボタンで保存
- 設定を忘れると、アプリが動作しません（500エラーになります）

### 4. Deploy
- 「Deploy」ボタンを押す
- ビルドログを確認（通常 1〜2 分で完了）
- 完了したら表示される URL をメモ

### 5. 動作確認
- デプロイされた URL にアクセス
- フォームに入力して「変換する」を試す
- 正常に 3 パターンのセールス文が生成されれば成功

### 6. README の更新
デプロイ URL が確定したら、以下のファイルを編集して push してください：

- `README.md` の `## ライブデモ` セクションにある URL を実際のものに置き換え

例：
```markdown
## ライブデモ

**https://voice-to-sales-xxx.vercel.app**
```

### トラブルシューティング

- **API エラーが出る** → Vercel の Environment Variables に `ANTHROPIC_API_KEY` が正しく設定されているか確認
- **ビルドエラー** → `npm run build` をローカルで成功させてから push する
- **無料制限が効かない** → ブラウザの localStorage を使っているため、シークレットモードや別ブラウザではリセットされます（仕様）

### ローカル vs 本番の違い
- ローカル：`.env.local` からキーを読み込む
- Vercel：ダッシュボードで設定した Environment Variables から読み込む

---

**参考**: プロジェクトの `README.md` にも同様の手順を記載しています。
