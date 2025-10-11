# 読書記録 アプリケーション

このアプリケーションは、読書記録を管理するためのシステムです。  
ユーザーは新規登録、ログイン、書籍情報の登録・閲覧・編集・削除が可能です。

---

## 概要

- **バックエンド**: Laravel 10
- **フロントエンド**: React
- **データベース**: MySQL
- **コンテナ管理**: Docker

---

## 環境構築

以下の手順で環境を構築してください。

### 1. リポジトリのクローン

```bash
git clone <リポジトリのURL>
cd smarthospital
```

### 2. Dockerコンテナの起動

```bash
docker-compose up --build -d
```

### 3. Laravelの初期設定

```bash
docker-compose exec laravel-app php artisan migrate --seed
docker-compose exec laravel-app php artisan key:generate
```

### 4. Reactアプリケーションのセットアップ

```bash
docker-compose exec react-app npm install
docker-compose exec react-app npm start
```

### 5. キャッシュのクリア

Dockerコンテナを起動した後、Laravelのキャッシュをクリアするには以下のコマンドを実行してください。

```bash
docker-compose exec laravel-app php artisan config:clear
docker-compose exec laravel-app php artisan route:clear
docker-compose exec laravel-app php artisan view:clear
docker-compose exec laravel-app php artisan optimize
docker-compose exec laravel-app php artisan cache:clear
```

これにより、古い設定やキャッシュが原因で発生する問題を防ぐことができます。

---

## ドキュメント

各構成に関する詳細な情報は以下のドキュメントを参照してください。

- [Laravel アプリケーション ドキュメント](./docs/laravel-app-doc.md)
- [React アプリケーション ドキュメント](./docs/react-docs.md)
- [エラーとトラブルシューティング](./docs/error.md)

---

## 注意事項

- `.env`ファイルの設定が必要です。詳細は各ドキュメントを参照してください。
- Dockerが正しくインストールされていることを確認してください。

---

これで環境構築が完了します。アプリケーションを起動して動作を確認してください。
