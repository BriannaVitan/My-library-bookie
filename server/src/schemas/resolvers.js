import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import { GraphQLError } from 'graphql';
const resolvers = {
    Query: {
        me: async (_, __, context) => {
            if (!context.user) {
                throw new GraphQLError('Not authenticated');
            }
            const user = await User.findOne({ _id: context.user._id });
            if (!user) {
                throw new GraphQLError('User not found');
            }
            return user;
        },
    },
    Mutation: {
        addUser: async (_, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken({
                username: user.username,
                email: user.email,
                _id: user._id
            });
            return { token, user };
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new GraphQLError('User not found');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new GraphQLError('Incorrect credentials');
            }
            const token = signToken({
                username: user.username,
                email: user.email,
                _id: user._id
            });
            return { token, user };
        },
        saveBook: async (_, { bookData }, context) => {
            if (!context.user) {
                throw new GraphQLError('Not authenticated');
            }
            try {
                const updatedUser = await User.findByIdAndUpdate(context.user._id, { $addToSet: { savedBooks: bookData } }, { new: true, runValidators: true });
                if (!updatedUser) {
                    throw new GraphQLError('User not found');
                }
                return updatedUser;
            }
            catch (err) {
                throw new GraphQLError('Error saving book');
            }
        },
        removeBook: async (_, { bookId }, context) => {
            if (!context.user) {
                throw new GraphQLError('Not authenticated');
            }
            const updatedUser = await User.findOneAndUpdate({ _id: context.user._id }, { $pull: { savedBooks: { bookId } } }, { new: true });
            if (!updatedUser) {
                throw new GraphQLError('User not found');
            }
            return updatedUser;
        },
    },
};
export default resolvers;
