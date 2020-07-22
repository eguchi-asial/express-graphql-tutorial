'use strict';

import express from 'express';
const { graphqlHTTP } = require('express-graphql');
import { buildSchema } from 'graphql';

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
  type Query {
    hello: String
  }
`);
const root = {
  hello: () => {
    return 'Hello world!';
  },
};
app.use('/', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(8080,()=>{ console.log('Example app listening on port 8080!') });
