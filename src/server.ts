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
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);
/* リゾルバ */
const rootResolver = {
  rollDice: ({ numDice, numSides }: { numDice: number, numSides: number }) => {
    var output = [];
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  }
};

app.use('/', graphqlHTTP({
  schema: schema,
  rootValue: rootResolver,
  graphiql: true,
}));
app.listen(8080, ()=>{ console.log('Example app listening on port 8080!') });
