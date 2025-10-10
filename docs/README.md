# Docker 起動手順

このドキュメントでは、Docker を使用して Laravel と React アプリケーションを起動する手順を説明します。

## 前提条件

- Docker および Docker Compose がインストールされていること。
- プロジェクトのルートディレクトリに `docker-compose.yml` ファイルが存在していること。

## 起動手順

1. **プロジェクトのルートディレクトリに移動**

   ```bash
   cd /path/to/smarthospital
   ```

2. **Docker コンテナをビルドして起動**

   ```bash
   docker-compose up --build
   ```

   - `--build` オプションは、Docker イメージを再ビルドする場合に使用します。

3. **コンテナの状態を確認**

   ```bash
   docker-compose ps
   ```

   - コンテナが正常に起動していることを確認します。

4. **Laravel の初期設定**

   Laravel コンテナに入って以下のコマンドを実行します。

   ```bash
   docker-compose exec app bash
   php artisan migrate --seed
   php artisan storage:link
   ```

   - データベースのマイグレーションとシーディングを実行します。
   - ストレージリンクを作成します。

5. **React アプリケーションの起動**

   React アプリケーションを開発モードで起動するには、以下のコマンドを実行します。

   ```bash
   docker-compose exec node bash
   npm install
   npm start
   ```

   - 必要に応じて依存関係をインストールします。

## アクセス方法

- Laravel API: `http://localhost`
- React アプリケーション: `http://localhost:3000`

## トラブルシューティング

- **コンテナが起動しない場合**

  ```bash
  docker-compose logs
  ```

  - ログを確認します。

- **CORS エラーが発生する場合**
  - Nginx の設定を確認し、適切な CORS ヘッダーが設定されていることを確認してください。

- **データベース接続エラー**
  - `.env` ファイルのデータベース設定を確認してください。

以上の手順で Docker を使用した環境構築が完了します。