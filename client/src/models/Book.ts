export interface BookType {
  bookId: string;
  authors: string[];
  title: string;
  description?: string;
  image?: string;
  link?: string;
  rating?: number;
  averageRating?: number;
  totalRatings?: number;
}

export interface SavedBookIds {
  [key: string]: boolean;
}