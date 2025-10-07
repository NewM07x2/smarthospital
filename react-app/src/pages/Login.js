import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/login', { email, password })
      login(response.data.user, response.data.token)
    } catch (err) {
      setError('ログインに失敗しました。')
    }
  }

  return (
    <div>
      <h1>ログイン</h1>
      {error && <p className='error'>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>メールアドレス</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>パスワード</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type='submit' className='btn'>
          ログイン
        </button>
      </form>
    </div>
  )
}

export default Login
