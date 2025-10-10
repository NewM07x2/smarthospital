# Docker 管理コマンド集

## 1. 基本的な起動手順

### コンテナの停止・削除
```bash
docker-compose down
```

### コンテナをビルドして起動
```bash
# フォアグラウンドで起動（ログが表示される）
docker-compose up --build

# バックグラウンドで起動（デタッチモード）
docker-compose up --build -d
```

## 2. 状態確認コマンド

### コンテナの状態確認
```bash
# 実行中のコンテナ確認
docker ps

# 全てのコンテナ確認（停止中も含む）
docker ps -a
```

### ログの確認
```bash
# 全サービスのログ確認
docker-compose logs

# 特定のサービスのログ確認
docker-compose logs web
docker-compose logs laravel-app
docker-compose logs react-app
docker-compose logs db

# リアルタイムでログを監視
docker-compose logs -f
```

## 3. 問題解決用コマンド

### ポートの使用状況確認
```bash
# ポート8000が使用されているかチェック
netstat -an | findstr :8000

# ポート3000が使用されているかチェック
netstat -an | findstr :3000
```

### Dockerネットワーク確認
```bash
# ネットワーク一覧
docker network ls

# 特定のネットワークの詳細
docker network inspect smarthospital_app-network
```

### コンテナ内部へのアクセス
```bash
# Laravelコンテナに入る
docker-compose exec laravel-app bash

# Nginxコンテナに入る
docker-compose exec web sh

# Reactコンテナに入る
docker-compose exec react-app sh

# MySQLコンテナに入る
docker-compose exec db bash
```

## 4. Laravel固有の確認コマンド

### Laravelコンテナ内で実行するコマンド
```bash
# コンテナに入る
docker-compose exec laravel-app bash

# ルート一覧を確認
php artisan route:list

# 設定のキャッシュ
php artisan config:cache

# マイグレーション実行
php artisan migrate --force

# ストレージリンク作成
php artisan storage:link

# キャッシュクリア
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

## 5. 完全リセット（問題が解決しない場合）

### 段階的なリセット
```bash
# 1. コンテナを停止
docker-compose down

# 1.1 ボリュームも削除する場合
docker-compose down -v

# 2. 不要なデータを削除
docker system prune -f

# 3. 特定のボリュームを削除（必要に応じて）
docker volume rm smarthospital_db-data

# 4. 再ビルド・起動
docker-compose up --build
```

### 強制的な完全リセット
```bash
# すべてのコンテナ、イメージ、ボリュームを削除
docker system prune -a --volumes

# 再ビルド・起動
docker-compose up --build
```

## 6. トラブルシューティング

### よくある問題と解決方法

#### プロキシエラー（ECONNREFUSED）

```
エラー例: "Proxy error: Could not proxy request /api/register from localhost:3000 to http://localhost:8000 (ECONNREFUSED)."
```

**原因**: Laravel APIサーバーが起動していない、またはポート8000にアクセスできない

**解決手順**:
```bash
# 1. 全コンテナの状態確認
docker ps -a

# 2. 特定のサービスが起動していない場合
docker-compose logs web
docker-compose logs laravel-app

# 3. コンテナを再起動
docker-compose down
docker-compose up --build

# 4. ポート8000がアクセス可能か確認
curl http://localhost:8000

# 5. Nginxコンテナ内でPHPの動作確認
docker-compose exec web curl http://laravel-app:9000
```

#### 403 Forbidden エラー

```
エラー例: curl http://localhost:8000 で 403 Forbidden が返される
```

**原因**: Nginxの設定問題、Laravel の public ディレクトリの権限問題、またはindex.phpが見つからない

**解決手順**:
```bash
# 1. Nginxコンテナのログ確認
docker-compose logs web

# 2. Laravelのpublic/index.phpが存在するか確認
docker-compose exec web ls -la /var/www/html/public/

# 3. ファイル権限の確認と修正
docker-compose exec laravel-app chmod -R 755 /var/www/html
docker-compose exec laravel-app chown -R www-data:www-data /var/www/html

# 4. Laravel の .env ファイル確認
docker-compose exec laravel-app cat /var/www/html/.env

# 5. Laravelのキーが設定されているか確認
docker-compose exec laravel-app php artisan key:generate

# 6. 直接PHPでアクセステスト
docker-compose exec laravel-app php /var/www/html/public/index.php

# 7. Nginxの設定ファイル確認
docker-compose exec web cat /etc/nginx/conf.d/default.conf
```

#### ポート競合エラー
```bash
# ポートを使用しているプロセスを確認
netstat -an | findstr :8000

# プロセスを終了（必要に応じて）
taskkill /PID <プロセスID> /F
```

#### データベース接続エラー
```bash
# データベースコンテナのログ確認
docker-compose logs db

# データベースコンテナに入ってMySQLにアクセス
docker-compose exec db mysql -u root -p
```

#### 権限エラー
```bash
# Laravelのストレージ権限設定
docker-compose exec laravel-app chmod -R 775 storage
docker-compose exec laravel-app chmod -R 775 bootstrap/cache
```

## 7. 推奨実行順序

1. **初回起動時**
   ```bash
   docker-compose up --build
   ```

2. **問題が発生した場合**
   ```bash
   docker-compose down
   docker-compose up --build
   ```

3. **完全にリセットが必要な場合**
   ```bash
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```