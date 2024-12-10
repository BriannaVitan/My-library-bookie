<<<<<<< HEAD
export interface Book {
  authors: string[],
  description: string;
  bookId: string;
  image: string;
  link: string;
  title: string;
}
=======
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
>>>>>>> 08a4a89a73adfb3298c0352d1be62a5fcc3db371
