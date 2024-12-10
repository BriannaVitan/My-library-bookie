// import user model
import User from '../models/User.js';
// import book model
import Book from '../models/Book.js';
// import review model
import Review from '../models/Review.js';
// import sign token function from auth
import { signToken } from '../services/auth.js';

// get a single user by either their id or their username
export const getSingleUser = async (req, res) => {
    try {
        const foundUser = await User.findOne({
            $or: [{ _id: req.user ? req.user._id : req.params.id }, { username: req.params.username }],
        });
        if (!foundUser) {
            return res.status(400).json({ message: 'Cannot find a user with this id!' });
        }
        return res.json(foundUser);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user', error });
    }
};

// create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
export const createUser = async ({ body }, res) => {
    try {
        const user = await User.create(body);
        if (!user) {
            return res.status(400).json({ message: 'Something is wrong!' });
        }
        const token = signToken({
            username: user.username,
            email: user.email,
            _id: user._id
        });
        res.json({ token, user });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating user', error });
    }
};

// login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
export const login = async ({ body }, res) => {
    try {
        const user = await User.findOne({ $or: [{ username: body.email }, { email: body.email }] });
        if (!user) {
            return res.status(400).json({ message: "Can't find this user" });
        }
        const correctPw = await user.isCorrectPassword(body.password);
        if (!correctPw) {
            return res.status(400).json({ message: 'Wrong password!' });
        }
        const token = signToken({
            username: user.username,
            email: user.email,
            _id: user._id
        });
        res.json({ token, user });
    } catch (error) {
        return res.status(500).json({ message: 'Error logging in', error });
    }
};

// save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
// user comes from `req.user` created in the auth middleware function
export const saveBook = async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate({ _id: req.user._id }, { $addToSet: { savedBooks: req.body } }, { new: true, runValidators: true });
        return res.json(updatedUser);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
};

export const deleteBook = async (req, res) => {
    const updatedUser = await User.findOneAndUpdate({ _id: req.user._id }, { $pull: { savedBooks: { bookId: req.params.bookId } } }, { new: true });
    if (!updatedUser) {
        return res.status(404).json({ message: "Couldn't find user with this id!" });
    }
    return res.json(updatedUser);
};

export const addReview = async (req, res) => {
    const { bookId, reviewer, rating, comment } = req.body;
    try {
        const review = await Review.create({ bookId, reviewer, rating, comment });
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error });
    }
};

// get reviews for a book
export const getReviews = async (req, res) => {
    const { bookId } = req.params;
    try {
        const reviews = await Review.find({ bookId });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
};
