import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/books.css';

function App() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [pageCount, setPageCount] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [books, setBooks] = useState([]);
  const [editBook, setEditBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showText, setShowText] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:9090/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleCreateOrUpdateBook = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);

      const bookData = {
        title,
        author,
        year,
        description,
        pageCount,
        imageUrl
      };

      if (editBook) {
        await axios.put(`http://localhost:9090/api/books/${editBook.id}`, bookData);
        alert('Book updated');
      } else {
        await axios.post('http://localhost:9090/api/books', bookData);
        alert('Book created');
      }

      setTitle('');
      setAuthor('');
      setYear('');
      setDescription('');
      setPageCount('');
      setImageUrl('');
      setEditBook(null);
      fetchBooks();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create/update book');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:9090/api/books/${id}`);
      alert('Book deleted');
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBook = (book) => {
    setEditBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setYear(book.year);
    setDescription(book.description);
    setPageCount(book.pageCount);
    setImageUrl(book.imageUrl);
    setShowText(null);
  };

  const handleImageClick = (id) => {
    setShowText(id);
  };

  const handleRatingChange = async (book, newRating) => {
    try {
      const updatedBookData = {
        ...book,
        rating: newRating 
      };
      await axios.put(`http://localhost:9090/api/books/${book.id}`, updatedBookData);
      fetchBooks(); 
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  return (
    <div>
      <div className='form-container'>
        <h1>Book Management</h1>
        <form onSubmit={handleCreateOrUpdateBook}>
          <label htmlFor="title"></label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            placeholder="Title"
          />
          <br /><br />
          <label htmlFor="author"></label>
          <input
            type="text"
            id="title"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            required
            placeholder="Author"
          />
          <br /><br />
          <label htmlFor="year"></label>
          <input
            type="number"
            id="title"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            required
            placeholder="Publication year"
          />
          <br /><br />
          <label htmlFor="description"></label>
          <input
            type="text"
            id="title"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            placeholder="Short description"
          />
          <br /><br />
          <label htmlFor="pageCount"></label>
          <input
            type="number"
            id="title"
            value={pageCount}
            onChange={(event) => setPageCount(event.target.value)}
            required
            placeholder="Page count"
          />
          <br /><br />
          <label htmlFor="imageUrl"></label>
          <input
            type="text"
            id="title"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            required
            placeholder="Image URL"
          />
          <br /><br />
          <button className='Create-button' type="submit" disabled={loading}>
            {editBook ? 'Update Book' : 'Create Book'}
          </button>
        </form>
      </div>
      <h2 className='bb'>Books</h2>
      <div className='books-box'>
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <div className="book-card">
                {showText === book.id ? (
                  <div className="book-details">
                    <p>Author: {book.author}</p>
                    <p>Year: {book.year}</p>
                    <p>Description: {book.description}</p>
                    <p>Page Count: {book.pageCount}</p>
                    <div className="rating">
                      {[...Array(5)].map((star, index) => {
                        const ratingValue = 5 - index;
                        return (
                          <React.Fragment key={index}>
                            <input
                              type="radio"
                              id={`star${ratingValue}-${book.id}`}
                              name={`rating-${book.id}`}
                              value={ratingValue}
                              checked={book.rating === ratingValue}
                              onChange={() => handleRatingChange(book, ratingValue)}
                            />
                            <label htmlFor={`star${ratingValue}-${book.id}`}>&#9733;</label>
                          </React.Fragment>
                        );
                      })}
                    </div>
                    <button className='list-button' onClick={() => handleEditBook(book)}>Edit</button>
                    <button className='list-button' onClick={() => handleDeleteBook(book.id)}>Delete</button>
                  </div>
                ) : (
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="book-image"
                    onClick={() => handleImageClick(book.id)}
                  />
                )}
                <h3 className='book-title'>{book.title}</h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
