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



改善点
:3000/register:1 Access to XMLHttpRequest at 'http://localhost:8000/api/register' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
と新規登録ができない。
原因
APIのURLが間違っている？
po-rt:8000ではなくport:80にする?
解決策
react-app/src/App.jsのaxios.defaults.baseURLを'http://localhost/api'に変更
■修正内容
react-app/src/App.js
--- a/file:///Users/mnitta/smarthospital/react-app/src/App.js
+++ b/file:///Users/mnitta/smarthospital/react-app/src/App.js
@@ -11,7 +11,7 @@   import Header from './components/Header';
 
 // API Configuration
-axios.defaults.baseURL = 'http://localhost:8000/api';  --- IGNORE ---
+axios.defaults.baseURL = 'http://localhost/api';
 axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';                  


 📝 残りの推奨改善点
Docker環境の再起動
cd "c:\Users\masato.nitta\mnitta\my-devlop\smarthospital"
docker-compose down
docker-compose up --build

Laravel側の初期設定
# コンテナ内で実行
php artisan migrate
php artisan db:seed

React側の依存関係インストール
npm install
npm start
🎯 主な改善ポイント
ポート設定: 8000:80 は正しい設定です
API URL: http://localhost:8000/api も正しい設定です
CORS問題: Nginx設定とLaravel CORS設定の両方で解決
認証: Sanctumの適切な設定を追加