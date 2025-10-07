import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.password_confirmation) {
      setError('パスワードが一致しません')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post('/register', formData)
      console.log('登録成功:', response)
      onLogin(response.data.user, response.data.token)
    } catch (error) {
      console.error('登録エラー:', error)
      if (error.response) {
        // サーバーからのレスポンスエラー
        setError(error.response.data?.message || '登録に失敗しました')
      } else if (error.request) {
        // ネットワークエラー（CORS等）
        setError(
          'サーバーに接続できません。ネットワーク設定を確認してください。'
        )
      } else {
        // その他のエラー
        setError('予期しないエラーが発生しました')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='auth-container'>
      <div className='auth-form'>
        <h2>新規登録</h2>

        {error && <div className='error-message'>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='name'>名前</label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='email'>メールアドレス</label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>パスワード</label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength='8'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password_confirmation'>パスワード確認</label>
            <input
              type='password'
              id='password_confirmation'
              name='password_confirmation'
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              disabled={loading}
              minLength='8'
            />
          </div>

          <button type='submit' className='submit-btn' disabled={loading}>
            {loading ? '登録中...' : '登録'}
          </button>
        </form>

        <p className='auth-link'>
          すでにアカウントをお持ちの方は
          <Link to='/login'>ログイン</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
