# Laravel アプリケーション ドキュメント

このドキュメントは、`smarthospital`プロジェクトのバックエンド（Laravelアプリケーション）に関するセットアップ手順、設定、および主要なコマンドについて説明します。

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

## 10. ディレクトリ構造

以下は `laravel-app` ディレクトリの全体構造です。

```text
laravel-app/
├── app/                  # アプリケーションのコアコード
│   ├── Console/         # Artisanコマンド関連
│   ├── Exceptions/      # 例外ハンドリング
│   ├── Http/            # コントローラー、ミドルウェア、リクエスト
│   │   ├── Controllers/ # コントローラー
│   │   ├── Middleware/  # ミドルウェア
│   └── Models/          # Eloquentモデル
├── bootstrap/            # フレームワークのブートストラップ
├── config/               # 設定ファイル
├── database/             # データベース関連
│   ├── factories/       # ファクトリ
│   ├── migrations/      # マイグレーション
│   └── seeders/         # シーダー
├── public/               # 公開ディレクトリ（ドキュメントルート）
├── resources/            # ビュー、CSS、JavaScriptなどのリソース
│   ├── css/             # CSSファイル
│   ├── js/              # JavaScriptファイル
│   └── views/           # Bladeテンプレート
├── routes/               # ルート定義
│   ├── api.php          # APIルート
│   ├── channels.php     # ブロードキャストチャンネル
│   ├── console.php      # コンソールコマンドルート
│   └── web.php          # ウェブルート
├── storage/              # ストレージ（キャッシュ、ログ、アップロードファイル）
│   ├── app/             # アプリケーションストレージ
│   ├── framework/       # フレームワーク関連
│   └── logs/            # ログファイル
├── tests/                # テストコード
│   ├── Feature/         # 機能テスト
│   └── Unit/            # 単体テスト
├── artisan               # Artisanコマンドラインツール
├── composer.json         # Composer設定ファイル
├── composer.lock         # Composerロックファイル
├── package.json          # Node.jsパッケージ設定
├── phpunit.xml           # PHPUnit設定ファイル
└── server.php            # ローカル開発用サーバースクリプト
```

このディレクトリ構造は、Laravelプロジェクトの標準的な構成を反映しています。

---

## 11. Laravel ソースコードの追い方と処理の流れ

Laravelのソースコードを追跡し、処理の流れを理解するための基本的な手順を以下に示します。

### 11.1 エントリーポイント

Laravelアプリケーションのエントリーポイントは、`public/index.php`です。このファイルは、すべてのリクエストを受け取り、アプリケーションの初期化とリクエストの処理を開始します。

```php
// public/index.php
require __DIR__.'/../bootstrap/app.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

$response->send();

$kernel->terminate($request, $response);
```

### 11.2 リクエストのライフサイクル

1. **`bootstrap/app.php`**:
   - アプリケーションインスタンスを作成します。
   - サービスプロバイダーや設定をロードします。

2. **`Http/Kernel.php`**:
   - ミドルウェアを登録します。
   - リクエストを適切なルートにディスパッチします。

3. **ルートの解決**:
   - `routes/web.php` または `routes/api.php` に定義されたルートに基づいて、対応するコントローラーやクロージャを呼び出します。

4. **コントローラーの実行**:
   - ルートで指定されたコントローラーメソッドが実行されます。
   - 必要に応じてモデルやサービスを呼び出します。

5. **レスポンスの生成**:
   - コントローラーから返されたデータがビューやJSONレスポンスに変換され、クライアントに送信されます。

### 11.3 デバッグのポイント

- **ルートの確認**:
  - `php artisan route:list` コマンドを使用して、すべてのルートを確認できます。

- **サービスプロバイダー**:
  - `App/Providers` ディレクトリ内のプロバイダーを確認し、どのサービスが登録されているかを把握します。

- **ミドルウェア**:
  - `Http/Kernel.php` に登録されているミドルウェアを確認し、リクエストがどのように処理されるかを追跡します。

- **ログ**:
  - `storage/logs/` ディレクトリ内のログファイルを確認して、エラーやデバッグ情報を取得します。

### 11.4 処理の流れを追うためのツール

- **Laravel Telescope**:
  - リクエスト、クエリ、例外などをリアルタイムで監視できる公式ツール。
  - インストールコマンド:
    ```bash
    composer require laravel/telescope
    php artisan telescope:install
    php artisan migrate
    ```

- **デバッグバー**:
  - `barryvdh/laravel-debugbar` パッケージを使用して、リクエストやクエリの詳細を確認できます。
  - インストールコマンド:
    ```bash
    composer require barryvdh/laravel-debugbar --dev
    ```

これらの手順とツールを活用することで、Laravelアプリケーションの処理の流れを効率的に追跡できます。

---

以上が Laravel プロジェクトの構築および再構築手順です。
