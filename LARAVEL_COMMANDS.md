# Laravel構築クイックリファレンス

別デバイスで実行する主要コマンドのまとめです。

## 前提: docker-compose.ymlの修正

以下の箇所を`laravel`から`laravel-app`に変更：

```yaml
  app:
    volumes:
      - ./laravel-app:/var/www/html # laravel → laravel-app

  web:
    volumes:
      - ./laravel-app:/var/www/html # laravel → laravel-app
```

## 実行コマンド一覧

```bash
# 1. Laravel プロジェクト作成
docker-compose run --rm app composer create-project --prefer-dist laravel/laravel:^10.0 laravel-app

# 2. Laravel 初期設定
cd laravel-app
cp .env.example .env
cd ..

# 3. アプリケーションキー生成とマイグレーション
docker-compose run --rm app php artisan key:generate
docker-compose run --rm app php artisan migrate

# 4. Laravel Sanctum インストール
docker-compose run --rm app composer require laravel/sanctum
docker-compose run --rm app php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
docker-compose run --rm app php artisan migrate

# 5. モデルとコントローラー作成
docker-compose run --rm app php artisan make:model Book -m
docker-compose run --rm app php artisan make:controller Auth/RegisterController
docker-compose run --rm app php artisan make:controller Auth/LoginController
docker-compose run --rm app php artisan make:controller BookController --resource

# 6. マイグレーション実行（Bookテーブル作成後）
docker-compose run --rm app php artisan migrate

# 7. コンテナ起動
docker-compose up -d

# 8. 設定反映とキャッシュクリア
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan route:clear
docker-compose exec app php artisan view:clear
```

詳細な手順は `LARAVEL_SETUP.md` を参照してください。