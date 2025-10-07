# React App セットアップ手順

このドキュメントでは、`npx create-react-app react-app`でReactアプリケーションを作成した後の設定手順を説明します。

## 1. 前提条件

以下のコマンドを実行してReactアプリケーションを作成してください：

```bash
cd /path/to/smarthospital
npx create-react-app react-app
cd react-app
```

## 2. 必要な依存関係の追加

以下のパッケージをインストールしてください：

```bash
npm install react-router-dom axios
```

## 3. ファイル構成

create-react-appで作成された後、以下のディレクトリ構造にファイルを追加/編集してください：

```
react-app/
├── public/
│   └── index.html (編集)
├── src/
│   ├── App.js (編集)
│   ├── index.js (編集)
│   ├── index.css (編集)
│   ├── contexts/
│   │   └── AuthContext.js (新規作成)
│   ├── components/
│   │   ├── Header.js (新規作成)
│   │   └── ProtectedRoute.js (新規作成)
│   └── pages/
│       ├── Home.js (新規作成)
│       ├── Login.js (新規作成)
│       ├── Register.js (新規作成)
│       ├── BookList.js (新規作成)
│       └── AddBook.js (新規作成)
└── package.json (依存関係追加済み)
```

## 4. ディレクトリ作成

以下のディレクトリを作成してください：

```bash
mkdir src/contexts
mkdir src/components
mkdir src/pages
```

## 5. ファイル編集・作成

### 5.1 public/index.html の編集

`<title>`タグと`<meta>`タグを以下のように変更：

```html
<title>読書記録アプリ</title>
<meta name="description" content="読書記録アプリ" />
```

### 5.2 src/index.css の編集

既存のCSSを以下の内容に置き換えてください：

```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

* {
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-danger {
  background-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
}

.card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header {
  background-color: #f8f9fa;
  padding: 1rem 0;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 2rem;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 20px;
}

.nav a {
  text-decoration: none;
  color: #007bff;
  font-weight: 500;
}

.nav a:hover {
  color: #0056b3;
}

.error {
  color: #dc3545;
  margin-top: 5px;
  font-size: 14px;
}

.success {
  color: #28a745;
  margin-top: 5px;
  font-size: 14px;
}
```

### 5.3 src/index.js の編集

既存のコードを以下に置き換え：

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 5.4 src/App.js の編集

既存のコードを以下に置き換え：

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookList from './pages/BookList';
import AddBook from './pages/AddBook';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <div className="container">
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
              <Route 
                path="/add-book" 
                element={
                  <ProtectedRoute>
                    <AddBook />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

## 6. 新規ファイル作成

以下のファイルを新規作成してください：

### 6.1 src/contexts/AuthContext.js

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // axiosのベースURL設定
  axios.defaults.baseURL = 'http://localhost:8000/api';
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // トークンの有効性を確認
      axios.get('/user')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/login', { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'ログインに失敗しました' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/register', { name, email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || '登録に失敗しました' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 6.2 src/components/Header.js

```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
            読書記録アプリ
          </Link>
          <ul>
            {user ? (
              <>
                <li><Link to="/books">本一覧</Link></li>
                <li><Link to="/add-book">本を追加</Link></li>
                <li>
                  <span style={{ marginRight: '10px' }}>こんにちは、{user.name}さん</span>
                  <button onClick={handleLogout} className="btn btn-secondary">
                    ログアウト
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login">ログイン</Link></li>
                <li><Link to="/register">会員登録</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
```

### 6.3 src/components/ProtectedRoute.js

```javascript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

### 6.4 src/pages/Home.js

```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>読書記録アプリへようこそ</h1>
      {user ? (
        <div>
          <p>こんにちは、{user.name}さん！</p>
          <p>読んだ本の記録を管理できます。</p>
          <div style={{ marginTop: '20px' }}>
            <Link to="/books" className="btn" style={{ marginRight: '10px' }}>
              本一覧を見る
            </Link>
            <Link to="/add-book" className="btn">
              本を追加する
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <p>読んだ本のタイトル、日付、感想を記録できるアプリです。</p>
          <p>利用するには会員登録またはログインが必要です。</p>
          <div style={{ marginTop: '20px' }}>
            <Link to="/register" className="btn" style={{ marginRight: '10px' }}>
              会員登録
            </Link>
            <Link to="/login" className="btn btn-secondary">
              ログイン
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
```

### 6.5 src/pages/Login.js

```javascript
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/books');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>ログイン</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading} className="btn">
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        アカウントをお持ちでない方は{' '}
        <Link to="/register">こちらから会員登録</Link>
      </p>
    </div>
  );
};

export default Login;
```

### 6.6 src/pages/Register.js

```javascript
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return;
    }

    setLoading(true);

    const result = await register(name, email, password);
    
    if (result.success) {
      navigate('/books');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>会員登録</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">名前</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">パスワード（確認）</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading} className="btn">
          {loading ? '登録中...' : '会員登録'}
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        既にアカウントをお持ちの方は{' '}
        <Link to="/login">こちらからログイン</Link>
      </p>
    </div>
  );
};

export default Register;
```

### 6.7 src/pages/BookList.js

```javascript
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/books');
      setBooks(response.data);
    } catch (error) {
      setError('本の一覧の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id) => {
    if (!window.confirm('この本を削除しますか？')) {
      return;
    }

    try {
      await axios.delete(`/books/${id}`);
      setBooks(books.filter(book => book.id !== id));
    } catch (error) {
      setError('本の削除に失敗しました');
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>読んだ本一覧</h2>
        <Link to="/add-book" className="btn">
          本を追加
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {books.length === 0 ? (
        <div className="card">
          <p>まだ本が登録されていません。</p>
          <Link to="/add-book" className="btn">
            最初の本を追加する
          </Link>
        </div>
      ) : (
        <div>
          {books.map(book => (
            <div key={book.id} className="card">
              <h3>{book.title}</h3>
              <p><strong>読んだ日:</strong> {book.read_date}</p>
              <p><strong>感想:</strong></p>
              <p style={{ whiteSpace: 'pre-wrap' }}>{book.review}</p>
              <div style={{ marginTop: '15px' }}>
                <button 
                  onClick={() => deleteBook(book.id)}
                  className="btn btn-danger"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
```

### 6.8 src/pages/AddBook.js

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [readDate, setReadDate] = useState('');
  const [review, setReview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/books', {
        title,
        read_date: readDate,
        review
      });
      navigate('/books');
    } catch (error) {
      setError(error.response?.data?.message || '本の追加に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>本を追加</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">本のタイトル</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="readDate">読んだ日</label>
          <input
            type="date"
            id="readDate"
            value={readDate}
            onChange={(e) => setReadDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="review">感想</label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="この本についての感想を書いてください..."
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={loading} className="btn">
            {loading ? '追加中...' : '本を追加'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/books')}
            className="btn btn-secondary"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
```

## 7. 動作確認

設定完了後、以下のコマンドでアプリケーションを起動できます：

```bash
npm start
```

ブラウザで `http://localhost:3000` にアクセスして動作確認してください。

## 8. 注意事項

- Laravel APIが `http://localhost:8000` で起動している必要があります
- Laravel側のCORS設定が正しく設定されている必要があります
- Laravel Sanctumが正しく設定されている必要があります

## 9. トラブルシューティング

### 9.1 CORS エラーが発生する場合

Laravel側の `config/cors.php` で適切なCORS設定を行ってください。

### 9.2 認証エラーが発生する場合

Laravel側でSanctumが正しく設定されているか確認してください。

### 9.3 ネットワークエラーが発生する場合

LaravelのAPIサーバーが正しく起動しているか確認してください。