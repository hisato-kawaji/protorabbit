# プロジェクト概要

- 名称: My Next.js App (AI Product Planner UI)
- 目的: Next.js(App Router)で構築された簡易チャットUIとAPIを持つアプリ。Gemini でテキスト生成、GitHub App 経由でリポジトリ作成(API)を提供。
- 主な技術: Next.js 15, React 19, TypeScript, Tailwind CSS v4, ESLint(Flat/next), Node 20 (Docker ベース)
- 実行形態: `npm run dev` でローカル開発、`npm run build && npm run start` で本番、Docker/Docker Compose サポートあり。

## ディレクトリ構成
- `src/app`: App Router 配下のページ・API ルート
  - `src/app/page.tsx`: ルートページ
  - `src/app/api/chat/route.ts`: LLM(Gemini) 連携 API (ストリーミング応答)
  - `src/app/api/github/create-repo/route.ts`: GitHub App を用いたリポジトリ作成 API
  - `src/app/layout.tsx`, `src/app/globals.css`: レイアウトとグローバルスタイル
- `src/components`: UI コンポーネント(`Header`, `ChatMessages`, `MessageInput`)
- `src/lib/llm`: LLM 連携ロジック
  - `index.ts`: Gemini での生成処理
  - `types.ts`: 型(サポート LLM など)
- `src/lib/github.ts`: GitHub App 連携ユーティリティ (Octokit/App Auth)
- `public`: 静的アセット

## 主要設定ファイル
- `package.json`: スクリプト/依存関係
- `tsconfig.json`: TypeScript 設定 (`@/*` エイリアス)
- `next.config.ts`: Next.js 設定(現状デフォルト)
- `eslint.config.mjs`: ESLint Flat config (`next/core-web-vitals`, `next/typescript`)
- `postcss.config.mjs`: Tailwind v4 用 PostCSS プラグイン
- `Dockerfile` / `docker-compose.yml`: Docker ビルド/開発用

## API 概要
- POST `/api/chat`: { messages, provider } を受け取り、Gemini(固定)でストリーミング応答
- POST `/api/github/create-repo`: { name, description? } を受け取り、組織 `GITHUB_REPO_OWNER` にプライベートリポジトリを作成

## 注意点
- ランタイム依存が `package.json` に未追加: `@google/generative-ai`, `ai`, `@octokit/rest`, `@octokit/auth-app`
- 環境変数の設定が必須: `GEMINI_API_KEY`, `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`, `GITHUB_REPO_OWNER`