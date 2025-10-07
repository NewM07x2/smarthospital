#!/bin/sh

# DBホストは docker-compose.yml のサービス名 'db'、ポートは '3306'
echo "Waiting for database connection..."
# DB接続情報が必要なため、DB_USERNAME/DB_PASSWORDが適切に渡されているか確認
until echo 'SELECT 1' | mysql -h db -u ${DB_USERNAME} -p${DB_PASSWORD} ${DB_DATABASE} 2>/dev/null; do
    sleep 1
done
echo "Database is ready!"

# Laravelの起動準備
php artisan config:clear
php artisan view:clear

# データベースのマイグレーションを実行
# *注: 初回起動時のみ実行したい場合は、ロックファイルなどで制御が必要です。
#      ここではシンプルに、起動時に常に実行します。
php artisan migrate --force

# キャッシュをクリア（必要に応じて）
php artisan cache:clear
# PHP-FPMを起動 (DockerfileのCMDで指定された最終プロセス)
exec "$@"
