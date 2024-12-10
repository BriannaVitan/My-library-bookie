import { Schema, model, Document } from 'mongoose';

interface IBook extends Document {
  bookId: string;
  authors: string[];
  description: string;
  title: string;
  image: string;
  link: string;
  ratings: number[];
  averageRating: number;
  totalRatings: number;
}

const bookSchema = new Schema<IBook>({
  bookId: {
    type: String,
    required: true,
    unique: true,
  },
  authors: [String],
  description: String,
  title: {
    type: String,
    required: true,
  },
  image: String,
  link: String,
  ratings: {
    type: [Number],
    default: [],
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
});

const Book = model<IBook>('Book', bookSchema);

export { Book };