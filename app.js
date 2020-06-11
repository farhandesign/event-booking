const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');

// To add a schema:
// buildSchema function takes a string  and that string
// should define our schema
const { buildSchema } = require('graphql');

const app = express();

const events = [];

app.use(bodyParser.json());


// schema: should point at a valid GraphQl Schema
// rootValue: will point at a JS Object which has all
// the resolver functions in it.
// --> query: for fetching data
//--> and mutation: for changing data
// -- In type RootQuery we will define different endpoints
//    we support for incoming queries.
//--> In type RootMutation we will define our diff mutations
app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return events;
    },
    createEvent: (args) => {
      const event = {
        _id: Math.random().toString(),
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: args.eventInput.date
      }
      events.push(event);
      return event;
    }
  },
  graphiql: true
}));

app.listen(3500);
