import { ObjectId } from 'mongodb';

const review = {
    "_id": new ObjectId("..."),
    "book_id": new ObjectId("..."),
    "reviewer": "Reviewer Name",
    "rating": 5,
    "comment": "Great book!"
};


console.log(review);