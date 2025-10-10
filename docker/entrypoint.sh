#!/bin/sh

# DBホストは docker-compose.yml のサービス名 'db'、ポートは '3306'
echo "Waiting for database connection..."
# DB接続情報が必要なため、DB_USERNAME/DB_PASSWORDが適切に渡されているか確認
until echo 'SELECT 1' | mysql -h db -u ${DB_USERNAME} -p${DB_PASSWORD} ${DB_DATABASE} 2>/dev/null; do
    sleep 1
done
echo "Database is ready!"

# Laravelの起動準備
php artisan config:clear # 設定キャッシュをクリア
php artisan view:clear   # Viewキャッシュをクリア

# データベースのマイグレーションを実行 (migrate:freshに置換)
# ⚠️ 注意: 起動のたびに全テーブルを削除して再作成します。
php artisan migrate:fresh --force

# アプリケーションの最適化
php artisan optimize

# キャッシュをクリア
php artisan cache:clear

# PHP-FPMを起動 (DockerfileのCMDで指定された最終プロセス)
exec "$@"