const typeDefs = `#graphql
  type Book {
    _id: ID!
    title: String!
    author: String!
    publishedDate: String!
  }

  type Review {
    _id: ID!
    bookId: ID!
    reviewer: String!
    rating: Int!
    comment: String!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Auth {
    token: ID!
    user: User
  }

  input BookInput {
    title: String!
    author: String!
    publishedDate: String!
  }

  input ReviewInput {
    bookId: ID!
    reviewer: String!
    rating: Int!
    comment: String!
  }

  type Query {
    me: User
    books: [Book]
    reviews(bookId: ID!): [Review]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addBook(title: String!, author: String!, publishedDate: String!): Book
    addReview(bookId: ID!, reviewer: String!, rating: Int!, comment: String!): Review
  }
`;

export default typeDefs;
