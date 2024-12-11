export interface GoogleAPIVolumeInfo {
  infoLink: any;
  title: string;
  authors: string[];
  description: string;
  imageLinks: {
    smallThumbnail: string;
    thumbnail: string;
  };
}

export interface GoogleAPIBook {
    id: string;
    volumeInfo: GoogleAPIVolumeInfo;
}
