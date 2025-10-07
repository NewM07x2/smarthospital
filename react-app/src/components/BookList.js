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
      setError('本の一覧を取得できませんでした');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('この本を削除しますか？')) {
      try {
        await axios.delete(`/books/${id}`);
        setBooks(books.filter(book => book.id !== id));
      } catch (error) {
        setError('本の削除に失敗しました');
      }
    }
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div className="book-list-container">
      <div className="page-header">
        <h2>本一覧</h2>
        <Link to="/books/add" className="add-btn">
          新しい本を追加
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {books.length === 0 ? (
        <div className="empty-state">
          <p>まだ本が登録されていません。</p>
          <Link to="/books/add" className="add-btn">
            最初の本を追加する
          </Link>
        </div>
      ) : (
        <div className="book-grid">
          {books.map(book => (
            <div key={book.id} className="book-card">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">著者: {book.author}</p>
              <p className="book-isbn">ISBN: {book.isbn}</p>
              <p className="book-publication-date">
                出版日: {new Date(book.publication_date).toLocaleDateString('ja-JP')}
              </p>
              <div className="book-actions">
                <button 
                  onClick={() => handleDelete(book.id)}
                  className="delete-btn"
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