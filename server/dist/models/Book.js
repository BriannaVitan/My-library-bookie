import { Schema, model } from "mongoose";
const bookSchema = new Schema({
    bookId: {
        type: String,
        required: true,
    },
    authors: [
        {
            type: String,
        },
    ],
    description: String,
    title: {
        type: String,
        required: true,
    },
    image: String,
    link: String,
    ratings: [
        {
            rating: { type: Number, required: true },
            user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        },
    ],
    averageRating: {
        type: Number,
        default: 0,
    },
    totalRatings: {
        type: Number,
        default: 0,
    },
});
const Book = model("Book", bookSchema);
export { bookSchema, Book };
