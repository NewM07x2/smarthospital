import React, { useState } from 'react'
import axios from 'axios'

const AddBook = () => {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [review, setReview] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/books', { title, date, review })
      setTitle('')
      setDate('')
      setReview('')
    } catch (err) {
      setError('本の追加に失敗しました。')
    }
  }

  return (
    <div>
      <h1>本を追加</h1>
      {error && <p className='error'>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='title'>タイトル</label>
          <input
            type='text'
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='date'>読んだ日</label>
          <input
            type='date'
            id='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='review'>感想</label>
          <textarea
            id='review'
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>
        <button type='submit' className='btn'>
          追加
        </button>
      </form>
    </div>
  )
}

export default AddBook
