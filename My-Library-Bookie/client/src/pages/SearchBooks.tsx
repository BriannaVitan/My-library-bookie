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

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
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
        link: book.volumeInfo.infoLink,
        averageRating: book.volumeInfo.averageRating || 0,
        totalRatings: book.volumeInfo.ratingsCount || 0
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (bookId: string) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token || !bookToSave) {
      return false;
    }

    try {
      await saveBook({
        variables: { bookData: bookToSave }
      });

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

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
  );
};

export default SearchBooks;