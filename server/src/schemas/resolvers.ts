// import { IResolvers } from '@graphql-tools/utils';
// import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { signToken } from '../services/auth.js';
import { Book} from '../models/Book.js';
import User, { IUser } from '../models/User.js';

const resolvers =  {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      console.log('context.user', context.user);
      const user = await User.findById(context.user._id)
        .populate('savedBooks'); 

      if (!user) {
        console.log('No user found with the provided ID');
        return context;
      }
      console.log('user from get me resolver before send to client', user);
      return user;
    },
  },

  Mutation: {
    addUser: async (_parent: any, args: any): Promise<{ token: string; user: IUser }> => {
      try {
        if (!args.username || !args.email || !args.password) {
          throw new Error('All fields are required');
        }
        const existingUser = await User.findOne({ email: args.email });
        if (existingUser) {
          throw new Error('User already exists');
        }
        const submission = {
          username: args.username,
          email: args.email,
          password: args.password
        }
        console.log(submission);
        const user = await User.create(submission);
        
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
      } catch (err) {
        console.error(err);
        throw new Error('Error creating user');
      }
    },
  
    login: async (_parent: any, args: any): Promise<{ token: string; user: IUser }
    > => {
      try {
        const email = args.email;
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error('Invalid email or password');
        }
        // compare the password with the stored hash
        const validPassword = await user.isCorrectPassword(args.password);

        if (!validPassword) {
          throw new Error('Invalid email or password');
        }

        const token = signToken(user.username, user.email, user._id);

        return { token, user };
      } catch (err) {
        console.error(err);
        throw new Error('Error creating user');
      }
    },

    saveBook: async (_parent:any, args:any, context: any): Promise<{ user: any }
    > => {
      try {
        const user = context.user; 
        const { bookId, authors, description, title, image, link } = args;
        const newBook = { bookId, authors, description, title, image, link };

        //  const savedBook = await Book.create(newBook);
        const updatedUser = await User.findOneAndUpdate(
          {_id: user._id },
          { $addToSet: { savedBooks: newBook } },
          // { $addToSet: { savedBooks: savedBook } },
          { new: true, runValidators: true }
        );

        return { user: updatedUser};
      } catch (err) {
        console.error(err);
        throw new Error('Error creating user');
      }
    },
   
    removeBook: async (_parent:any, args:any, context: any) => {
      try {
        const user = context.user;
        const updatedUser = await User.findOneAndUpdate(
          {_id: user._id },
          { $pull: { savedBooks: { bookId: args.bookId} } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      } catch (err) {
        console.error(err);
        throw new Error('Error creating user');
      }
    },

    rateBook: async (_parent: any, { bookId, rating }: any, context: any) => {
      if (context.user) {
        try {
          if (rating < 1 || rating > 5) {
            throw new Error('Rating must be between 1 and 5');
          }
      
          // Find the book by bookId
          const book = await Book.findOne({ bookId });
      
          if (!book) {
            throw new Error('Book not found');
          }
      
          // Find if the user already rated the book
          const existingRatingIndex = book.ratings.findIndex(rating => rating.user === context.user.id);
          if (existingRatingIndex !== -1) {
            // Update existing rating
            book.ratings[existingRatingIndex] = rating;
          } else {
            // Add new rating
            book.ratings.push({ user: context.user.id, rating: rating });
          }
      
          // Update totalRatings and averageRating
          book.totalRatings = book.ratings.length;
          book.averageRating = book.totalRatings > 0
            ? book.ratings.reduce((a, b) => a + b.rating, 0) / book.totalRatings
            : 0;
      
          // Save the updated book
          const updatedRatings = await book.save();
      
          return updatedRatings;
        } catch (error) {
          
        }
        // Validate rating input
        
      }
    
      throw new Error('You need to be logged in to rate a book');
    }
    
  //   rateBook: async (_parent: any, bookId: any , rating: any , context: any) => {
  //     // rateBook: async (_parent: any, { bookId: any , rating: any }, context: any) => {
  //       if (context.user) {
  //         // Validate rating input
  //         if (rating < 1 || rating > 5) {
  //           throw new Error('Rating must be between 1 and 5');
  //         }
  
  //         // Find the book by bookId
  //         const book = await Book.findOne({ bookId });
  
  //         if (!book) {
  //           throw new Error('Book not found');
  //         }
  
  //         // Append the new rating
  //         book.ratings.push(rating);
  
  //         // Update averageRating and totalRatings
  //         book.totalRatings = book.ratings.length;
  //         book.averageRating = book.ratings.reduce((a, b) => a + b, 0) / book.totalRatings;
  
  //         // Save the updated book
  //         await book.save();
  
  //         return book;
  //       }
  //       throw new Error('You need to be logged in to rate a book');
  //     },
  //     // Add other mutations as needed
  //   },
  // };


  }};
export default resolvers;