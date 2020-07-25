'use strict';

import express, { NextFunction, Request, Response, response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList } from 'graphql';
const app: express.Express = express();

// fake DB
let fakeDatabase: fakeDatabaseKeys = {};
// fakeDatabaseのObject Key-Value型定義
interface fakeDatabaseKeys {
  [id: string]: {
    id: string,
    name: string
  }
}

fakeDatabase = {
  'a': {
    id: 'a',
    name: 'alice',
  },
  'b': {
    id: 'b',
    name: 'bob',
  },
};

/* スキーマ */
const userType = new GraphQLObjectType({
  name: 'user',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString }
  }
});
/* schema and resolver */
// query
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: userType,
      args: {
        id: { type: GraphQLString }
      },
      resolve: (_, { id }) => {
        return fakeDatabase[id]
      }
    },
    users: {
      type: new GraphQLList(userType),
      resolve: _ => {
        return Object.keys(fakeDatabase).map(id => ({
          id,
          name: fakeDatabase[id].name
        }))
      }
    }
  }
})
// mutation
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    registUser: {
      type: userType,
      args: {
        name: { type: GraphQLString }
      },
      resolve: (_, { name }) => {
        if (!name) throw new Error('name is required')
        const id = require('crypto').randomBytes(10).toString('hex');
        fakeDatabase[id] = {
          id,
          name
        };
        return fakeDatabase[id]
      }
    },
    updateUser: {
      type: userType,
      args: {
        id: { type: GraphQLString },
        name: { type: GraphQLString }
      },
      resolve: (_, { id, name }) => {
        if (!fakeDatabase[id]) throw new Error(`${id} does not exist`)
        if (!name) throw new Error('name is required')
        fakeDatabase[id] = {
          id,
          name: name
        }
        return fakeDatabase[id]
      }
    },
    deleteUser: {
      type: userType,
      args: {
        id: { type: GraphQLString }
      },
      resolve: (_, { id }) => {
        if (!fakeDatabase[id]) throw new Error(`${id} does not exist`)
        delete fakeDatabase[id]
        return response.status(204)
      }
    }
  }
})

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
  schema: new GraphQLSchema({
    query: queryType,
    mutation: mutationType
  }),
  graphiql: true
}));
app.listen(8080, ()=>{ console.log('Example app listening on port 8080!') });
