const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

mongoose.connect(`mongodb+srv://farhan_design:${process.env.MONGO_PASSWORD}@cluster0.mafhi.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
  .then(() => {
    app.listen(3500);
  })
  .catch(err => console.log(err));


