■課題
新規会員登録ができ、ログイン機能を有する、読んだ本のタイトルと読んだ日、読んだ感想が保存できるサイトを構築してください。

■条件
APIとフロントエンドを分割して作成してください。
API側はLaravel10で作成してください。
フロント側はreactで作成してください。
データの保存にはMySQLを利用してください。
構築にはdockerを利用してください。

■提出方法
githubのpublicリポジトリとして作成し、そのURLを提出ください。

■提出期限
課題を受け取ってから、7日以内での提出をお願いいたします。
稼働の関係で7日以上かかる場合は、事前に提出期限をお伝え下さい。


react-app/
├── package.json
├── .gitignore
├── public/
│   ├── index.html
│   └── robots.txt
└── src/
    ├── index.js          # エントリポイント
    ├── index.css         # グローバルスタイル
    ├── App.js            # メインアプリコンポーネント
    ├── contexts/
    │   └── AuthContext.js # 認証状態管理
    ├── components/
    │   ├── Header.js      # ヘッダーコンポーネント
    │   └── ProtectedRoute.js # 認証必須ルート
    └── pages/
        ├── Home.js        # ホームページ
        ├── Login.js       # ログインページ
        ├── Register.js    # 会員登録ページ
        ├── BookList.js    # 本一覧ページ
        └── AddBook.js     # 本追加ページ

## Laravelセットアップ手順

以下の手順でLaravelをセットアップしてください。

1. **Laravelプロジェクトの作成**

   ```bash
   docker-compose run --rm app composer create-project --prefer-dist laravel/laravel laravel-app
   ```

2. **.envファイルの設定**

   - `.env`ファイルを作成し、以下の内容を設定してください。

     ```env
     DB_CONNECTION=mysql
     DB_HOST=db
     DB_PORT=3306
     DB_DATABASE=your_database_name
     DB_USERNAME=your_username
     DB_PASSWORD=your_password
     ```

3. **Laravelの初期設定**

   ```bash
   docker-compose run --rm app php artisan key:generate
   docker-compose run --rm app php artisan migrate
   ```

4. **コンテナの起動**

   ```bash
   docker-compose up -d
   ```

## 認証機能の実装手順

1. **Laravel Breezeのインストール**

   ```bash
   docker-compose run --rm app composer require laravel/breeze --dev
   docker-compose run --rm app php artisan breeze:install api
   ```

2. **フロントエンドのセットアップ**

   ```bash
   docker-compose run --rm frontend npm install
   docker-compose run --rm frontend npm run build
   ```

3. **API認証の設定**

   Laravel Sanctumを使用してAPI認証を構築します。

   ```bash
   docker-compose run --rm app composer require laravel/sanctum
   docker-compose run --rm app php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
   docker-compose run --rm app php artisan migrate
   ```

4. **CORS設定の更新**

   `config/cors.php`を編集し、フロントエンドからのリクエストを許可します。

   ```php
   'paths' => ['api/*', 'sanctum/csrf-cookie'],
   ```

## APIエンドポイント作成手順

1. **コントローラーの作成**

   以下のコマンドを使用して、必要なコントローラーを作成します。

   ```bash
   docker-compose run --rm app php artisan make:controller Auth/RegisterController
   docker-compose run --rm app php artisan make:controller Auth/LoginController
   docker-compose run --rm app php artisan make:controller BookController
   ```

2. **ルートの設定**

   `routes/api.php`に以下のルートを追加します。

   ```php
   use App\Http\Controllers\Auth\RegisterController;
   use App\Http\Controllers\Auth\LoginController;
   use App\Http\Controllers\BookController;

   Route::post('/register', [RegisterController::class, 'register']);
   Route::post('/login', [LoginController::class, 'login']);

   Route::middleware('auth:sanctum')->group(function () {
       Route::get('/books', [BookController::class, 'index']);
       Route::post('/books', [BookController::class, 'store']);
       Route::get('/books/{id}', [BookController::class, 'show']);
       Route::put('/books/{id}', [BookController::class, 'update']);
       Route::delete('/books/{id}', [BookController::class, 'destroy']);
   });
   ```

3. **モデルとマイグレーションの作成**

   `Book`モデルとマイグレーションを作成します。

   ```bash
   docker-compose run --rm app php artisan make:model Book -m
   ```

   マイグレーションファイルを編集し、以下のようにテーブル構造を定義します。

   ```php
   Schema::create('books', function (Blueprint $table) {
       $table->id();
       $table->string('title');
       $table->date('read_date');
       $table->text('review');
       $table->timestamps();
   });
   ```

   マイグレーションを実行します。

   ```bash
   docker-compose run --rm app php artisan migrate
   ```

## APIエンドポイントの動作確認

以下のコマンドを使用して、APIエンドポイントが正しく動作するか確認してください。

### 1. ユーザー登録

```bash
curl -X POST http://localhost:8000/api/register \
-H "Content-Type: application/json" \
-d '{"name": "Test User", "email": "test@example.com", "password": "password", "password_confirmation": "password"}'
```

### 2. ログイン

```bash
curl -X POST http://localhost:8000/api/login \
-H "Content-Type: application/json" \
-d '{"email": "test@example.com", "password": "password"}'
```

### 3. 本の一覧取得

```bash
curl -X GET http://localhost:8000/api/books \
-H "Authorization: Bearer <your-auth-token>"
```

### 4. 本の登録

```bash
curl -X POST http://localhost:8000/api/books \
-H "Authorization: Bearer <your-auth-token>" \
-H "Content-Type: application/json" \
-d '{"title": "Sample Book", "read_date": "2025-10-01", "review": "This is a great book!"}'
```
