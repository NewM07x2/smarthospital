import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">
          <Link to="/">スマートホスピタル</Link>
        </h1>
        
        <nav className="nav">
          <Link to="/" className="nav-link">本一覧</Link>
          <Link to="/books/add" className="nav-link">本追加</Link>
        </nav>
        
        <div className="user-info">
          <span>ようこそ、{user.name}さん</span>
          <button onClick={handleLogout} className="logout-btn">
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;