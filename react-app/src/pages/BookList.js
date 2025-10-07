import React, { useEffect, useState } from 'react'
import axios from 'axios'

const BookList = () => {
  const [books, setBooks] = useState([])

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/books')
        setBooks(response.data)
      } catch (error) {
        console.error('Error fetching books:', error)
      }
    }

    fetchBooks()
  }, [])

  return (
    <div>
      <h1>本一覧</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} - {book.date}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BookList
