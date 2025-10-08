# Laravel 構築・再構築ガイド

このドキュメントでは、Laravel APIバックエンドの構築および再構築手順を説明します。

---

## 1. 前提条件

- Docker および Docker Compose がインストールされていること。
- プロジェクトのルートディレクトリに移動していること。

---

## 2. docker-compose.yml の修正

以下の箇所を修正してください：

```yaml
  app:
    build:
      context: .
      dockerfile: docker/php/Dockerfile
    container_name: laravel_app
    volumes:
      - ./laravel-app:/var/www/html # Laravelコードをマウント

  web:
    image: nginx:stable-alpine
    container_name: nginx_web
    volumes:
      - ./laravel-app:/var/www/html # Laravelコードをマウント
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
```

---

## 3. Laravel プロジェクトの構築

### 3.1 既存の Laravel ディレクトリを削除

```bash
rm -rf laravel-app
```

### 3.2 新しい Laravel プロジェクトの作成

```bash
docker-compose run --rm laravel-app composer create-project --prefer-dist laravel/laravel:^10.0 laravel-app
```

---

## 4. 環境設定

### 4.1 .env ファイルの設定

```bash
cd laravel-app
cp .env.example .env
cd ..
```

`.env` ファイルを編集し、データベースやアプリケーションの設定を行います。

---

## 5. 必要なパッケージのインストール

### 5.1 Laravel Sanctum のインストール

```bash
docker-compose run --rm laravel-app composer require laravel/sanctum
docker-compose run --rm laravel-app php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
docker-compose run --rm laravel-app php artisan migrate
```

---

## 6. アプリケーションキーの生成とマイグレーション

```bash
docker-compose run --rm laravel-app php artisan key:generate
docker-compose run --rm laravel-app php artisan migrate
```

---

## 7. モデルとコントローラーの作成

### 7.1 Book モデルとマイグレーション

```bash
docker-compose run --rm laravel-app php artisan make:model Book -m
```

### 7.2 コントローラーの作成

```bash
docker-compose run --rm laravel-app php artisan make:controller Auth/RegisterController
docker-compose run --rm laravel-app php artisan make:controller Auth/LoginController
docker-compose run --rm laravel-app php artisan make:controller BookController --resource
```

---

## 8. コンテナの起動

```bash
docker-compose up -d
```

---

## 9. 再構築手順

### 9.1 プロジェクトの削除

```bash
rm -r laravel
```

### 9.2 再構築

```bash
docker-compose run --rm laravel composer create-project --prefer-dist laravel/laravel .
```

---

以上が Laravel プロジェクトの構築および再構築手順です。