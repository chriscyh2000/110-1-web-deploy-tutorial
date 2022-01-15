import mongo from "./mongo"
import { GraphQLServer, PubSub } from 'graphql-yoga';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import Post from './resolvers/Post';
import Store from './resolvers/Store';
import User from './resolvers/User';
import Comment from './resolvers/Comment';
import db from './db';

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        // TODO: add the resolvers
        Query,
        Mutation,
        Subscription,
        Post,
        User,
        Comment,
        Store
    },
    context: {
        db,
        pubsub,
    },
});

mongo.connect();

server.start({ port: process.env.PORT | 5000 }, () => {
    console.log(`The server is up on port ${process.env.PORT | 5000}!`);
});
