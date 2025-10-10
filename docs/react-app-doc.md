# React アプリケーション ドキュメント

このドキュメントは、`smarthospital`プロジェクトのフロントエンド（Reactアプリケーション）に関するセットアップ手順、設定、および主要なスクリプトについて説明します。

---

## 1. 概要

このアプリケーションは`create-react-app`をベースに構築された読書記録管理アプリです。ユーザー認証（登録、ログイン、ログアウト）、書籍情報のCRUD（作成、読み取り、更新、削除）機能を提供します。

- **フレームワーク**: React
- **ルーティング**: `react-router-dom`
- **HTTP通信**: `axios`
- **状態管理**: `React Context` (認証情報)

---

## 2. 利用可能なスクリプト

開発ディレクトリ(`react-app/`)で、以下のコマンドを実行できます。

### `npm start`

開発モードでアプリを起動します。
ブラウザで [http://localhost:3000](http://localhost:3000) を開くと表示されます。

ファイル編集を行うと、ページは自動的にリロードされます。
コンソールにはLintエラーも表示されます。

### `npm test`

インタラクティブなウォッチモードでテストランナーを起動します。

### `npm run build`

本番用にアプリケーションを`build`フォルダにビルドします。
Reactが本番モードで正しくバンドルされ、ビルドが最高のパフォーマンスになるように最適化されます。

ビルドは縮小され、ファイル名にはハッシュが含まれます。
これでアプリはデプロイの準備が整いました。

---

## 3. セットアップ手順

### 3.0. 新規にReactプロジェクトを作成する場合 (参考)

何らかの理由でフロントエンド部分をゼロから再構築する必要がある場合の手順です。

1.  **Reactアプリケーションの作成**

    ```bash
    # プロジェクトのルートディレクトリに移動
    cd /path/to/smarthospital

    # create-react-appで`react-app`を作成
    npx create-react-app react-app
    ```

2.  **必要な依存関係の追加**

    ```bash
    cd react-app
    npm install react-router-dom axios
    ```

3.  **ディレクトリとファイルの配置**

    このドキュメントの「ディレクトリ構造」セクションを参考に、必要なディレクトリを作成し、各コンポーネントやページのファイルを配置してください。

### 3.1. Gitリポジトリからクローンする場合 (推奨)

このプロジェクトに新たに参加する開発者は、以下の手順で環境を構築します。

1.  **リポジトリをクローンする**

    ```bash
    git clone <リポジトリのURL>
    cd smarthospital
    ```

2.  **Dockerコンテナを起動する**

    プロジェクト全体のバックエンド（Laravel）とフロントエンド（React）を起動します。
    ```bash
    docker-compose up --build -d
    ```

3.  **Reactアプリの依存関係をインストールする**

    `react-app`コンテナ内で`npm install`を実行します。
    ```bash
    docker-compose exec react-app npm install
    ```
    *注意: `docker-compose.yml`の`command`で`npm install`が実行される設定になっている場合は、この手順は不要なことがあります。*

4.  **アプリケーションにアクセスする**

    -   フロントエンド (React): [http://localhost:3000](http://localhost:3000)
    -   バックエンド (Laravel API): [http://localhost:8000](http://localhost:8000)

---

## 4. 主要な設定と実装

### 4.1. APIエンドポイントの設定

`src/contexts/AuthContext.js`内で、`axios`のベースURLを一元的に設定しています。これにより、各コンポーネントでAPIのホスト名を記述する必要がなくなります。

```javascript
// src/contexts/AuthContext.js

// axiosのベースURL設定
// Docker環境でホストOSからAPIにアクセスする場合
axios.defaults.baseURL = 'http://localhost:8000/api';
```

### 4.2. 認証コンテキスト (`AuthContext.js`)

`React Context`を使用して、アプリケーション全体でユーザーの認証状態（ログインしているか、ユーザー情報は何か）を管理します。

- **`AuthProvider`**: 認証状態と関連する関数（`login`, `register`, `logout`）を配下のコンポーネントに提供します。
- **`useAuth`**: コンポーネントが認証情報にアクセスするためのカスタムフックです。
- **トークン管理**: ログイン時に受け取ったトークンを`localStorage`に保存し、アプリケーション起動時にトークンがあれば自動的にユーザー情報を取得します。

### 4.3. ルーティング (`App.js`)

`react-router-dom`を使用して、ページのルーティングを定義します。
認証が必要なページ（`/books`, `/add-book`など）は、`ProtectedRoute`コンポーネントでラップします。

```javascript
// src/App.js
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route 
    path="/books" 
    element={
      <ProtectedRoute>
        <BookList />
      </ProtectedRoute>
    } 
  />
  {/* ... 他のルート ... */}
</Routes>
```

### 4.4. 保護されたルート (`ProtectedRoute.js`)

このコンポーネントは、子コンポーネントをレンダリングする前にユーザーがログインしているかを確認します。ログインしていない場合は、自動的にログインページ（`/login`）にリダイレクトします。

---

## 5. トラブルシューティング

### 5.1. CORSエラーが発生する場合

Laravel側のCORS設定ファイル (`config/cors.php`) やNginxの設定 (`docker/nginx/default.conf`) を変更してもエラーが解消しない場合、Laravelのキャッシュが原因である可能性があります。

以下の手順でキャッシュをクリアし、設定を再読み込みさせてください。

1.  **Laravelの設定キャッシュをクリアする**

    `laravel-app`コンテナ内で以下のコマンドを実行し、古い設定を削除します。
    ```bash
    docker-compose exec laravel-app php artisan config:clear
    ```

2.  **Laravelのルートキャッシュをクリアする**

    ルート情報がキャッシュされている場合も問題を引き起こすことがあります。
    ```bash
    docker-compose exec laravel-app php artisan route:clear
    ```

3.  **コンテナを再起動する**

    最後に、コンテナを再起動して変更を確実に適用します。
    ```bash
    docker-compose restart
    ```

上記を実行後、再度ブラウザで動作を確認してください。

### 5.2. 認証エラーが発生する場合

Laravel側でSanctumが正しく設定されているか確認してください。特に`.env`ファイルの`SANCTUM_STATEFUL_DOMAINS`にフロントエンドのドメインが含まれているか確認します。

```dotenv
// .env
SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

### 5.3. ネットワークエラー (ECONNREFUSEDなど)

LaravelのAPIサーバー（Nginxコンテナ）がポート`8000`で正しく起動しているか確認してください。

```bash
# Dockerコンテナの状態を確認
docker ps

# Nginxコンテナのログを確認
docker-compose logs web
```

---

## ディレクトリ構造

`react-app`ディレクトリの主要なファイルとディレクトリの役割は以下の通りです。

```text
react-app/
├── public/               # 静的ファイル（index.html, faviconなど）を格納
│   └── index.html        # アプリケーションのルートHTMLファイル
│
├── src/                  # ソースコードのメインディレクトリ
│   ├── App.js            # アプリケーションのメインコンポーネント
│   ├── index.js          # アプリケーションのエントリーポイント
│   ├── index.css         # グローバルなCSSスタイル
│   │
│   ├── components/       # 再利用可能なUIコンポーネント
│   │   ├── AddBook.js        # 本を追加するフォーム
│   │   ├── BookList.js       # 本のリストを表示
│   │   ├── Header.js         # ヘッダー
│   │   ├── Login.js          # ログインフォーム
│   │   ├── ProtectedRoute.js # 認証付きルート
│   │   └── Register.js       # ユーザー登録フォーム
│   │
│   ├── contexts/         # Reactコンテキスト（状態管理）
│   │   └── AuthContext.js    # 認証状態を管理
│   │
│   ├── pages/            # 各ページに対応するコンポーネント
│   │   ├── Home.js           # ホームページ
│   │   ├── Login.js          # ログインページ
│   │   ├── Register.js       # 会員登録ページ
│   │   ├── BookList.js       # 書籍一覧ページ
│   │   └── AddBook.js        # 書籍追加ページ
│   │
│   └── utils/            # 汎用的な関数やヘルパー
│       └── formatDate.js   # 日付フォーマット用関数
│
├── package.json          # プロジェクトの依存関係とスクリプトを定義
└── .gitignore            # Gitの追跡から除外するファイルを指定
```

### `src` ディレクトリの詳細

- **`components/`**: アプリケーションの複数の場所で再利用される小さなUI部品（ヘッダー、ボタン、保護ルートなど）を配置します。
- **`contexts/`**: `React.Context`を使用してアプリケーション全体で共有する状態（例: ユーザーの認証情報）を管理します。
- **`pages/`**: アプリケーションの各ページ（ルート）に対応するコンポーネントを配置します。これらのコンポーネントは通常、複数の小さな`components`を組み合わせて構成されます。
- **`utils/`**: 特定のコンポーネントに依存しない、プロジェクト全体で利用できるヘルパー関数（日付のフォーマットなど）を配置します。
