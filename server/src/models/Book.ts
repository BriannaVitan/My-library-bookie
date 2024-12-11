import { Schema, model } from "mongoose";

export interface IBook {
  bookId: string;
  authors: string[];
  description: string;
  title: string;
  image: string;
  link: string;
  ratings: { rating: number; user: string }[];
  averageRating: number;
  totalRatings: number;
}

const bookSchema = new Schema<IBook>({
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

const Book = model<IBook>("Book", bookSchema);

export { bookSchema, Book };
