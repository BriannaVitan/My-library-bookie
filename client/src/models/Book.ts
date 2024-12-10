
export interface Rating {
  userId: string;
  rating: number;
}


export interface Book {
  authors: string[],
  description: string;
  bookId: string;
  image: string;
  link: string;
  title: string;
}

export interface BookType {
  bookId: string;
  authors: string[];
  title: string;
  description?: string;
  image?: string;
  link?: string;
  ratings: Rating[];
  averageRating: number;
  totalRatings: number;
}

export interface GoogleBookResponse {
  id: string;
  volumeInfo: {
    authors?: string[];
    title: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
    infoLink?: string;
  };
}

export interface SavedBookIds {
  [key: string]: boolean;
}

