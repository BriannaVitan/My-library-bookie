import { Schema, model, type Document } from 'mongoose';

export interface ReviewDocument extends Document {
  bookId: string;
  reviewer: string;
  rating: number;
  comment: string;
}

const reviewSchema = new Schema<ReviewDocument>({
  bookId: {
    type: Schema.Types.String,
    ref: 'Book',
    required: true,
  },
  reviewer: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

const Review = model<ReviewDocument>('Review', reviewSchema);

export default Review;