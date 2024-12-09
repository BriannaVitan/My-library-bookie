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
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!searchInput) {
      return;
    }

    try {
      setLoading(true);
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
        link: book.volumeInfo.infoLink
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle saving a book
  const handleSaveBook = async (bookId: string) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token || !bookToSave) {
      return;
    }

    try {
      await saveBook({
        variables: { bookData: bookToSave }
      });

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fade-in">
      <div className="search-header text-light bg-dark p-4 p-md-5">
        <Container>
          <h1 className="mb-4">Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row className="g-3">
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
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
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

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
  );
};

export default SearchBooks;