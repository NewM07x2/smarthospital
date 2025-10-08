# Laravel プロジェクト再構築手順

## 1. Laravel プロジェクトの削除

現在の Laravel プロジェクトを削除します。

```bash
rm -r laravel
```

---

## 2. 新しい Laravel プロジェクトの作成

新しい Laravel プロジェクトを作成します。

```bash
docker-compose run --rm laravel composer create-project --prefer-dist laravel/laravel .
```

---

## 3. 必要なパッケージのインストール

Laravel の依存関係をインストールします。

```bash
docker-compose run --rm laravel composer install
```

---

## 4. 環境ファイルの設定

`.env` ファイルを設定します。

```bash
cp .env.example .env
```

その後、`.env` ファイルを編集して、データベースやアプリケーションの設定を行います。

---

## 5. アプリケーションキーの生成

Laravel のアプリケーションキーを生成します。

```bash
docker-compose run --rm laravel php artisan key:generate
```

---

## 6. データベースのマイグレーション

データベースを初期化します。

```bash
docker-compose run --rm laravel php artisan migrate
```

---

## 7. キャッシュのクリア

キャッシュをクリアしておきます。

```bash
docker-compose run --rm laravel php artisan config:clear
docker-compose run --rm laravel php artisan cache:clear
docker-compose run --rm laravel php artisan route:clear
docker-compose run --rm laravel php artisan view:clear
```

---

## 8. Docker コンテナの再起動

すべてのコンテナを再起動します。

```bash
docker-compose down
docker-compose up -d
```

---

## 9. React アプリとの接続確認

ブラウザで React アプリを開き、Laravel API にアクセスして CORS エラーが解消されているか確認します。



# 1. Laravel Sanctumのインストール
docker-compose run --rm app composer require laravel/sanctum
docker-compose run --rm app php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# 2. マイグレーションの実行
docker-compose run --rm app php artisan migrate

# 3. コンテナの起動
docker-compose up -d

# 4. キャッシュクリア
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan route:clear
docker-compose exec app php artisan view:clear