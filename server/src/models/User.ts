import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import type { IBook }  from './Book.js';
import { bookSchema } from './Book.js';


// import type IBook from './Book.js'; reopen if savedBooks: BookDocument is needed.

// Define the interface for User document
export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  // savedBooks: IBook[]; maybe use if below doesnt work.
  savedBooks?: IBook[];
  isCorrectPassword(password: string): Promise<boolean>;
  bookCount?: number;
}
  // savedBooks: Array<{
  //   review: string;
  //   bookId: string;
  //   authors: string[];
  //   description: string;
  //   title: string;
  //   image: string;
  //   link: string;
  // }>;
  // isCorrectPassword(password: string): Promise<boolean>;
  // bookCount: number;


const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must use a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  // set savedBooks to be an array of data that adheres to the bookSchema
  savedBooks: [
    {
      type: bookSchema
    },
  ],
},
// set this to use virtual below
{
  toJSON: {
    virtuals: true,
  },
}
);
//   },
//   savedBooks: [{
//     bookId: {
//       type: String,
//       required: true,
//     },
//     authors: [String],
//     description: {
//       type: String,
//     },
//     title: {
//       type: String,
//       required: true,
//     },
//     image: {
//       type: String,
//     },
//     link: {
//       type: String,
//     },
//   }],
// });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// when we query a user, we'll also get another field called `bookCount` with the number of saved books we have
userSchema.virtual('bookCount').get(function () {
  return this.savedBooks?.length || 0;
});

// create model in db
const User = model<IUser>('User', userSchema);

export default User;