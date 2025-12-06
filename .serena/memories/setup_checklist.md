# 初期設定チェックリスト

1) Node.js とパッケージ
- [ ] Node 20.x を用意 (nvm などで切替推奨)
- [ ] `npm install` を実行
- [ ] 次を追加インストール: `@google/generative-ai ai @octokit/rest @octokit/auth-app`

2) 環境変数 (.env.local)
- [ ] `GEMINI_API_KEY` (Google Generative AI の API キー)
- [ ] `GITHUB_APP_ID` (GitHub App の App ID)
- [ ] `GITHUB_APP_PRIVATE_KEY` (PEM。改行は `\n` でエスケープ)
- [ ] `GITHUB_REPO_OWNER` (インストール先の Organization/Owner ログイン名)

3) 動作確認
- [ ] `npm run dev` で http://localhost:3000 を表示
- [ ] `POST /api/chat` に投げてストリーミング応答を確認
- [ ] `POST /api/github/create-repo` でリポジトリ作成を確認

4) 品質
- [ ] `npm run lint` で Lint が通ること

5) Docker(任意)
- [ ] `docker compose up --build` で開発起動
- [ ] 本番イメージは `docker build` -> `docker run` で確認