# タスク完了時の確認事項

- コード品質
  - `npm run lint` がエラーなく完了
  - ビルド: `npm run build` が成功 (型エラーなし)
- 実行確認
  - `npm run dev` で該当画面/エンドポイントが期待動作
- 依存/設定
  - 新規依存を追加した場合は `package.json` を更新
  - 必要な環境変数を README か `.env.example` に追記
- ドキュメント
  - 使い方/設定が変わった場合は `README.md` を更新
- 任意
  - Docker での起動/ビルドが通るか軽く確認