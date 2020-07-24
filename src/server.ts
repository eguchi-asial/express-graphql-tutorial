'use strict';

import express from 'express';
const { graphqlHTTP } = require('express-graphql');
import { buildSchema } from 'graphql';
import { info } from 'console';

const app: express.Express = express();

// body-parserに基づいた着信リクエストの解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORSの許可
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/* スキーマ */
const schema = buildSchema(`
  input MessageInput {
    content: String
  }

  type Message {
    id: ID!
    content: String
  }

  type Query {
    getMessage(id: ID!): Message
    getAllMessages: [Message]
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

class Message {
  id: string;
  content: string;

  constructor(id: string, { content }: {content: string}) {
    this.id = id;
    this.content = content;
  }
}

// Maps username to content
let fakeDatabase: fakeDatabaseKeys = {};
interface fakeDatabaseKeys {
  [id: string]: any
}

/**
 * 引数は基本的に暗黙的argsの分割代入
 */
const rootResolver = {
  getMessage: ({id}: {id: string}) => {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    return new Message(id, fakeDatabase[id]);
  },
  getAllMessages: () => {
    const messages: Message[] = []
    Object.keys(fakeDatabase).map(key => {
      messages.push(new Message(key, fakeDatabase[key]))
    })
    return messages
  },
  createMessage: ({ input }: { input: string }) => {
    // Create a random id for our "database".
    const id = require('crypto').randomBytes(10).toString('hex');

    fakeDatabase[id] = input;
    return new Message(id, { content: input });
  },
  updateMessage: ({ id, input }: { id: string, input: string }) => {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    return new Message(id, { content: input });
  }
}

app.use('/', graphqlHTTP({
  schema: schema,
  rootValue: rootResolver,
  graphiql: true,
}));
app.listen(8080, ()=>{ console.log('Example app listening on port 8080!') });
