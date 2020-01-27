const express = require('express');
const bodyparser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const isAuth = require('./middleware/is-auth');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyparser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === "OPTIONS"){
        return res.sendStatus(200);
    }
    next();
});

app.get('/', (req, res, next) => {
    res.send('<h1>Welcome to react graphql</h1>');
    next();
});

app.use(isAuth);

app.use('/graphql',  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-mlciu.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
.then(() => {
    app.listen(3002);
}).catch(err => {
    console.log(err);
});
