# Laravel API構築手順書

このドキュメントでは、読書記録アプリのLaravel APIバックエンドを構築する手順を説明します。

## 前提条件

- Docker および Docker Compose がインストールされていること
- プロジェクトのルートディレクトリに移動していること

## 事前準備: docker-compose.ymlの修正

まず、docker-compose.ymlファイルでLaravelのマウントパスを修正します。

`docker-compose.yml`の以下の部分を修正：

```yaml
  app:
    build:
      context: .
      dockerfile: docker/php/Dockerfile
    container_name: laravel_app
    volumes:
      - ./laravel-app:/var/www/html # Laravelコードをマウント（laravel→laravel-appに変更）

  web:
    image: nginx:stable-alpine
    container_name: nginx_web
    volumes:
      - ./laravel-app:/var/www/html # Laravelコードをマウント（laravel→laravel-appに変更）
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
```

## ステップ1: Laravelプロジェクトの作成

既存のlaravel-appディレクトリが不完全な場合は削除してから新規作成します。

```bash
# 既存のlaravel-appディレクトリを削除（必要に応じて）
rm -rf laravel-app

# Laravel10プロジェクトの新規作成
docker-compose run --rm app composer create-project --prefer-dist laravel/laravel:^10.0 laravel-app
```

## ステップ2: .envファイルの設定

Laravel用の環境変数を設定します。

```bash
# laravel-appディレクトリに移動
cd laravel-app

# .envファイルをコピー
cp .env.example .env
```

`.env`ファイルを以下の内容に編集してください：

```env
APP_NAME="読書記録アプリ"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=book
DB_USERNAME=book
DB_PASSWORD=book

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

# Sanctum設定
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1
SESSION_DOMAIN=localhost
```

## ステップ3: Laravelの初期設定

```bash
# プロジェクトルートに戻る
cd ..

# アプリケーションキーの生成
docker-compose run --rm app php artisan key:generate

# データベースのマイグレーション
docker-compose run --rm app php artisan migrate
```

## ステップ4: Laravel Sanctumのインストール

API認証にLaravel Sanctumを使用します。

```bash
# Laravel Sanctumのインストール
docker-compose run --rm app composer require laravel/sanctum

# Sanctum設定ファイルの公開
docker-compose run --rm app php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Sanctumのマイグレーション実行
docker-compose run --rm app php artisan migrate
```

## ステップ5: モデルとマイグレーションの作成

### Bookモデルの作成

```bash
# Bookモデルとマイグレーションを作成
docker-compose run --rm app php artisan make:model Book -m
```

作成されたマイグレーションファイル `database/migrations/xxxx_xx_xx_xxxxxx_create_books_table.php` を以下のように編集：

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->date('read_date');
            $table->text('review');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
```

### マイグレーションの実行

```bash
docker-compose run --rm app php artisan migrate
```

## ステップ6: コントローラーの作成

### 認証コントローラーの作成

```bash
# 認証用コントローラーの作成
docker-compose run --rm app php artisan make:controller Auth/RegisterController
docker-compose run --rm app php artisan make:controller Auth/LoginController

# 本管理用コントローラーの作成
docker-compose run --rm app php artisan make:controller BookController --resource
```

## ステップ7: APIルートの設定

`routes/api.php` ファイルを以下の内容に編集：

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\BookController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 認証不要のルート
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);

// 認証が必要なルート
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::post('/logout', [LoginController::class, 'logout']);
    
    // 本関連のAPI
    Route::apiResource('books', BookController::class);
});
```

## ステップ8: CORS設定の更新

`config/cors.php` ファイルを以下のように編集：

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost',
        'http://localhost:8000',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 86400,

    'supports_credentials' => true,
];
```

## ステップ9: Kernelの設定

`app/Http/Kernel.php` のAPIミドルウェアグループに以下を追加：

```php
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    \Illuminate\Routing\Middleware\ThrottleRequests::class.':api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

## ステップ10: User モデルの更新

`app/Models/User.php` を以下のように更新：

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function books()
    {
        return $this->hasMany(Book::class);
    }
}
```

## ステップ11: Book モデルの更新

`app/Models/Book.php` を以下のように更新：

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'read_date',
        'review',
    ];

    protected $casts = [
        'read_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

## ステップ12: コントローラーの実装

### RegisterController の実装

`app/Http/Controllers/Auth/RegisterController.php`:

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }
}
```

### LoginController の実装

`app/Http/Controllers/Auth/LoginController.php`:

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['認証情報が正しくありません。'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'ログアウトしました。'
        ]);
    }
}
```

### BookController の実装

`app/Http/Controllers/BookController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $books = $request->user()->books()->latest()->get();
        return response()->json($books);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'read_date' => 'required|date',
            'review' => 'required|string',
        ]);

        $book = $request->user()->books()->create([
            'title' => $request->title,
            'read_date' => $request->read_date,
            'review' => $request->review,
        ]);

        return response()->json($book, 201);
    }

    public function show(Request $request, $id)
    {
        $book = $request->user()->books()->findOrFail($id);
        return response()->json($book);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'read_date' => 'required|date',
            'review' => 'required|string',
        ]);

        $book = $request->user()->books()->findOrFail($id);
        $book->update([
            'title' => $request->title,
            'read_date' => $request->read_date,
            'review' => $request->review,
        ]);

        return response()->json($book);
    }

    public function destroy(Request $request, $id)
    {
        $book = $request->user()->books()->findOrFail($id);
        $book->delete();

        return response()->json([
            'message' => '本を削除しました。'
        ]);
    }
}
```

## ステップ13: コンテナの起動

```bash
# コンテナを起動
docker-compose up -d

# または、再ビルドして起動
docker-compose up --build -d
```

## ステップ14: 設定の反映とキャッシュクリア

```bash
# 設定キャッシュをクリア
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan route:clear
docker-compose exec app php artisan view:clear

# 設定をキャッシュ（本番環境時）
# docker-compose exec app php artisan config:cache
```

## ステップ15: 動作確認

### API エンドポイントの確認

以下のエンドポイントが利用可能になります：

- `POST /api/register` - 会員登録
- `POST /api/login` - ログイン
- `POST /api/logout` - ログアウト（認証必要）
- `GET /api/user` - ユーザー情報取得（認証必要）
- `GET /api/books` - 本一覧取得（認証必要）
- `POST /api/books` - 本の追加（認証必要）
- `GET /api/books/{id}` - 本の詳細取得（認証必要）
- `PUT /api/books/{id}` - 本の更新（認証必要）
- `DELETE /api/books/{id}` - 本の削除（認証必要）

### cURLでのテスト例

```bash
# 会員登録
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"テストユーザー","email":"test@example.com","password":"password123"}'

# ログイン
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 本の追加（トークンが必要）
curl -X POST http://localhost:8000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"サンプル本","read_date":"2024-01-01","review":"とても良い本でした。"}'
```

## トラブルシューティング

### よくあるエラーと対処法

1. **CORS エラー**
   - `config/cors.php` の設定を確認
   - nginx の設定も確認

2. **データベース接続エラー**
   - `.env` ファイルのDB設定を確認
   - データベースコンテナが起動しているか確認

3. **認証エラー**
   - Sanctum の設定を確認
   - トークンが正しく設定されているか確認

## 完了

以上でLaravel APIバックエンドの構築が完了です。Reactフロントエンドと連携してテストしてください。