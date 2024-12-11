// import * as dotenv from 'dotenv';
import dotenv from 'dotenv';
dotenv.config();
import type { Request } from 'express';
import jwt from 'jsonwebtoken';
// import { GraphQLError } from 'graphql';
// import { Request } from 'express';
// import { Types } from 'mongoose';

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}
export const authenticateToken = (context: { req: Request }) => {
  // console.log('attempting to grab context', context);
  const { req }:any = context;

  // Extract the token from the Authorization header
  let token = req.headers.authorization || '';
  console.log('token from context:', token);
  if (token) {
    token = token.split(' ').pop()?.trim() || '';
  }

  // If no token is provided, return the context without modification
  if (!token) {
    console.log('No token found during auth')
    return context;
  }
  console.log('token exists', token);
  // Try to verify the token
  try {
    const data = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || '',
      { maxAge: '2h' }
    ) as { data: JwtPayload };
    console.log('Verified token data: ',data);
    // If the token is valid, attach the user data to the context
    return { ...context, user: data };
  } catch (err) {
    // If the token is invalid, log an error message
    console.error('Invalid token:', err);
    return context;
  }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

// interface TokenUser {
//   username: string;
//   email: string;
//   _id: Types.ObjectId | string;
// }

// const secret = process.env.JWT_SECRET || 'mysecretsshhhhh';
// const expiration = '2h';

// export const authMiddleware = async ({ req }: { req: Request }) => {
//   let token = req.body.token || req.query.token || req.headers.authorization;

//   if (req.headers.authorization) {
//     token = token.split(' ').pop().trim();
//   }

//   if (!token) {
//     return req;
//   }

//   try {
//     const { data } = jwt.verify(token, secret) as { data: TokenUser };
//     req.user = data;
//   } catch {
//     console.log('Invalid token');
//     throw new GraphQLError('Invalid token', {
//       extensions: { code: 'UNAUTHENTICATED' },
//     });
//   }

//   return req;
// };

// export const signToken = (username: string, email: string, _id: Types.ObjectId, user: TokenUser) => {
//   const payload = { 
//     username: user.username, 
//     email: user.email, 
//     _id: user._id.toString() 
//   };
//   return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
// };