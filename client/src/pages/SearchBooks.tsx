<<<<<<< HEAD
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import { SAVE_BOOK, RATE_BOOK } from '../utils/mutations';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import Auth from '../utils/auth';
import StarRating from '../components/StarRating/StarRating';
import { BookType } from '../types/book';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState<BookType[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState<string[]>(getSavedBookIds());

  // Set up mutations
  const [saveBook] = useMutation(SAVE_BOOK);
  const [rateBook] = useMutation(RATE_BOOK);

=======
import React, { useState } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const SearchBooks = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchedBooks, setSearchedBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedBookIds, setSavedBookIds] = useState<string[]>([]);

  // Set up mutations
  const [saveBook] = useMutation(SAVE_BOOK);

  // Handle form submission
>>>>>>> 0d1497f (added responsive design)
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!searchInput) {
<<<<<<< HEAD
      return false;
    }

    try {
=======
      return;
    }

    try {
      setLoading(true);
>>>>>>> 0d1497f (added responsive design)
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchInput}`
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book: any) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
<<<<<<< HEAD
        link: book.volumeInfo.infoLink,
        averageRating: book.volumeInfo.averageRating || 0,
        totalRatings: book.volumeInfo.ratingsCount || 0
=======
        link: book.volumeInfo.infoLink
>>>>>>> 0d1497f (added responsive design)
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
<<<<<<< HEAD
    }
  };

=======
    } finally {
      setLoading(false);
    }
  };

  // Handle saving a book
>>>>>>> 0d1497f (added responsive design)
  const handleSaveBook = async (bookId: string) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token || !bookToSave) {
<<<<<<< HEAD
      return false;
=======
      return;
>>>>>>> 0d1497f (added responsive design)
    }

    try {
      await saveBook({
        variables: { bookData: bookToSave }
      });

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
<<<<<<< HEAD
      saveBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRateBook = async (bookId: string, rating: number) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await rateBook({
        variables: { bookId, rating }
      });

      // Update the local state with the new rating
      setSearchedBooks(books => 
        books.map(book => 
          book.bookId === bookId 
            ? { 
                ...book, 
                rating,
                averageRating: ((book.averageRating || 0) * (book.totalRatings || 0) + rating) / ((book.totalRatings || 0) + 1),
                totalRatings: (book.totalRatings || 0) + 1
              }
            : book
        )
      );
=======
>>>>>>> 0d1497f (added responsive design)
    } catch (err) {
      console.error(err);
    }
  };

  return (
<<<<<<< HEAD
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
=======
    <div className="fade-in">
      <div className="search-header text-light bg-dark p-4 p-md-5">
        <Container>
          <h1 className="mb-4">Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row className="g-3">
>>>>>>> 0d1497f (added responsive design)
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
<<<<<<< HEAD
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
=======
                  className="w-100"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button 
                  type='submit' 
                  variant='success' 
                  size='lg'
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Submit Search'}
>>>>>>> 0d1497f (added responsive design)
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

<<<<<<< HEAD
      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image && (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  )}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors.join(', ')}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <div className="rating-section">
                      <StarRating
                        initialRating={book.rating}
                        onRatingChange={(rating) => handleRateBook(book.bookId, rating)}
                      />
                      <span className="rating-count">
                        ({book.totalRatings} ratings, avg: {book.averageRating?.toFixed(1)})
                      </span>
                    </div>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.includes(book.bookId)}
                        className='btn-block btn-info mt-2'
                        onClick={() => handleSaveBook(book.bookId)}>
                        {savedBookIds?.includes(book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
=======
      <Container className="py-4">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <h2 className='mb-4'>
              {searchedBooks.length
                ? `Viewing ${searchedBooks.length} results:`
                : 'Search for a book to begin'}
            </h2>
            <Row className="g-4">
              {searchedBooks.map((book) => (
                <Col xs={12} md={6} lg={4} key={book.bookId}>
                  <Card className="h-100 book-card">
                    {book.image && (
                      <div className="card-img-container">
                        <Card.Img 
                          src={book.image} 
                          alt={`The cover for ${book.title}`} 
                          variant='top' 
                          className="book-cover"
                        />
                      </div>
                    )}
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="h5 mb-2">{book.title}</Card.Title>
                      <p className='small mb-2'>Authors: {book.authors.join(', ')}</p>
                      <Card.Text className="book-description">
                        {book.description}
                      </Card.Text>
                      <div className="mt-auto">
                        {Auth.loggedIn() && (
                          <Button
                            disabled={savedBookIds.includes(book.bookId)}
                            className='w-100'
                            variant={savedBookIds.includes(book.bookId) ? 'secondary' : 'primary'}
                            onClick={() => handleSaveBook(book.bookId)}
                          >
                            {savedBookIds.includes(book.bookId)
                              ? 'Saved!'
                              : 'Save Book'}
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </div>
>>>>>>> 0d1497f (added responsive design)
  );
};

export default SearchBooks;