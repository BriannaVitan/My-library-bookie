import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';
import mongoose from 'mongoose';
const app = express();
const PORT = process.env.PORT || 3001;
// Create Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/library-bookie')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
const startServer = async () => {
    // Start Apollo Server
    await server.start();
    // Apply middleware
    app.use(express.json());
    app.use('/graphql', expressMiddleware(server));
    // Start Express server
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
};
startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
