import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($bookData: BookInput!) {
    saveBook(bookData: $bookData) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
<<<<<<< HEAD
=======
        rating
        averageRating
        totalRatings
>>>>>>> 08a4a89a73adfb3298c0352d1be62a5fcc3db371
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
<<<<<<< HEAD
      }
    }
  }
=======
        rating
        averageRating
        totalRatings
      }
    }
  }
`;

export const RATE_BOOK = gql`
  mutation rateBook($bookId: String!, $rating: Int!) {
    rateBook(bookId: $bookId, rating: $rating) {
      bookId
      title
      rating
      averageRating
      totalRatings
    }
  }
>>>>>>> 08a4a89a73adfb3298c0352d1be62a5fcc3db371
`;