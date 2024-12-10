import { IResolvers } from '@graphql-tools/utils';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { Book } from '../models/Book';
import { User } from '../models/User';

const resolvers: IResolvers = {
  Query: {
    // Existing query resolvers
    me: async (_parent, _args, context) => {
      if (context.user) {
        const userData = await User.findById(context.user._id)
          .select('-__v -password');
        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
    // Add other queries as needed
  },
  Mutation: {
    // Existing mutation resolvers
    rateBook: async (_parent, { bookId, rating }, context) => {
      if (context.user) {
        // Validate rating input
        if (rating < 1 || rating > 5) {
          throw new UserInputError('Rating must be between 1 and 5');
        }

        // Find the book by bookId
        const book = await Book.findOne({ bookId });

        if (!book) {
          throw new UserInputError('Book not found');
        }

        // Append the new rating
        book.ratings.push(rating);

        // Update averageRating and totalRatings
        book.totalRatings = book.ratings.length;
        book.averageRating = book.ratings.reduce((a, b) => a + b, 0) / book.totalRatings;

        // Save the updated book
        await book.save();

        return book;
      }
      throw new AuthenticationError('You need to be logged in to rate a book');
    },
    // Add other mutations as needed
  },
};

export default resolvers;