# よく使うコマンド

- セットアップ
  - Node 20系を使用 (Docker は `node:20-alpine`)
  - 依存インストール: `npm install`
  - 追加で必要な依存(未登録):
    - `npm install @google/generative-ai ai @octokit/rest @octokit/auth-app`
- 開発
  - 開発サーバ: `npm run dev` (http://localhost:3000)
  - Lint: `npm run lint`
- 本番
  - ビルド: `npm run build`
  - 起動: `npm run start`
- Docker
  - ビルド+起動(本番): `docker build -t my-app . && docker run -p 3000:3000 my-app`
  - 開発(ホットリロード): `docker compose up --build`
- GitHub API 検証
  - `POST /api/github/create-repo` に `{ name, description? }` を送る (環境変数要設定)
- Chat API 検証
  - `POST /api/chat` に `{ messages: [{role:"user",content:"..."}] }` を送る (Gemini APIキー要設定)