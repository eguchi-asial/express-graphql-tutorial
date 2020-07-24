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
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type Query {
    getDie(numSides: Int): RandomDie
  }
`);

class RandomDie {
  numSides: number;

  constructor(numSides: number) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({ numRolls }: { numRolls: number }) {
    const output = [];
    for (let i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

const rootResolver = {
  getDie: ({ numSides }: { numSides: number }) => {
    return new RandomDie(numSides || 6);
  }
}

app.use('/', graphqlHTTP({
  schema: schema,
  rootValue: rootResolver,
  graphiql: true,
}));
app.listen(8080, ()=>{ console.log('Example app listening on port 8080!') });
