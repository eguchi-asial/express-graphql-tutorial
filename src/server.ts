'use strict';

import express, { NextFunction, Request, Response } from 'express';
const { graphqlHTTP } = require('express-graphql');
import { buildSchema } from 'graphql';
const app: express.Express = express();

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
    ip: String
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

  constructor(id: string, { content }: { content: string }) {
    this.id = id;
    this.content = content;
  }
}

// fake DB
let fakeDatabase: fakeDatabaseKeys = {};
// fakeDatabaseのObject Key-Value型定義
interface fakeDatabaseKeys {
  [id: string]: { content: string }
}

/**
 * 引数は基本的に暗黙的argsの分割代入
 */
const rootResolver = {
  ip: function (args: {}, request: Request) {
    return request.ip;
  },
  getMessage: ({ id }: { id: string }) => {
    if (!fakeDatabase[id]) throw new Error('no message exists with id ' + id);
    return new Message(id, fakeDatabase[id]);
  },
  getAllMessages: () => {
    const messages: Message[] = []
    Object.keys(fakeDatabase).map(key => {
      messages.push(new Message(key, fakeDatabase[key]))
    })
    return messages
  },
  createMessage: ({ input }: { input: {content: string} }) => {
    if (!input || !input.content) throw new Error('input: { content: string } is required');
    // Create a random id for our "database".
    const id = require('crypto').randomBytes(10).toString('hex');

    fakeDatabase[id] = input;
    return new Message(id, input);
  },
  updateMessage: ({ id, input }: { id: string, input: { content: string } }) => {
    if (!input || !input.content) throw new Error('input: { content: string } is required');
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    fakeDatabase[id] = input;
    return new Message(id, input);
  }
}


// body-parserに基づいた着信リクエストの解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware
// request
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('ip:', req.ip);
  next();
})
// response
// CORSの許可
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use('/', graphqlHTTP({
  schema: schema,
  rootValue: rootResolver,
  graphiql: true,
}));
app.listen(8080, ()=>{ console.log('Example app listening on port 8080!') });
