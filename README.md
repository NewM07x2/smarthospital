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
