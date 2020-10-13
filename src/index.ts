import 'reflect-metadata';
import {MikroORM} from '@mikro-orm/core';
import microConfig from './mikro-orm.config';
import express from 'express';
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {HelloResolver} from "./resolvers/hello";
import {PostResolver} from "./resolvers/post";

const main = async () => {

    const mikroORM = await MikroORM.init(microConfig);
    await mikroORM.getMigrator().up();

    const app = express();

    /*
    This is how to make Rest endpoints whit Express

    app.get('/', ((_, res) => {
        res.send("Hello from Express!");
    }))
    */

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false
        }),
        context: () => ({em: mikroORM.em})
    });

    apolloServer.applyMiddleware({app});

    app.listen(4000, () => {
        console.log('Server started on localhost:4000');
    });
};

main().catch(error => {
    console.error(error);
});