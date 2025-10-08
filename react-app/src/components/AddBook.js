import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    read_date: '',
    review: '',
    publication_date: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/books', formData);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || '本の追加に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-book-container">
      <div className="page-header">
        <h2>新しい本を追加</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label htmlFor="title">タイトル</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="read_date">読書日</label>
          <input
            type="date"
            id="read_date"
            name="read_date"
            value={formData.read_date}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="review">感想</label>
          <textarea
            id="review"
            name="review"
            value={formData.review}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="cancel-btn"
            disabled={loading}
          >
            キャンセル
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '追加中...' : '追加'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;