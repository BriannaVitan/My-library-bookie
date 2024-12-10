import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]!
    bookCount: Int!
  }

  type Book {
    bookId: String!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
    ratings: [Int!]!  # Array to store individual ratings
    averageRating: Float!
    totalRatings: Int!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    # Add other queries as needed
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
    rateBook(bookId: String!, rating: Int!): Book
  }

  input BookInput {
    bookId: String!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }
`;