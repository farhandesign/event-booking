const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');

// To add a schema:
// buildSchema function takes a string  and that string
// should define our schema
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

const app = express();

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
      return Event.find()
        .then(events => {
          return events.map(event => {
            return { ...event._doc, _id: event.id };
          });
        }).catch(err => {
          throw err;
        });
    },
    createEvent: (args) => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date)
      });
      return event
        .save()
        .then(result => {
          console.log(result);
          return { ...result._doc, _id: result._doc._id.toString() };
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    }
  },
  graphiql: true
}));


// .connect method needs a connection string which
// is the address of our database cluster
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
  }@cluster0-mafhi.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
).then(() => {
  app.listen(3500);
}).catch(err => {
  console.log(err);
});


