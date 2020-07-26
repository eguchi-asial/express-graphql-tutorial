'use strict';

import express, { NextFunction, Request, Response, response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLInputObjectType, GraphQLUnionType } from 'graphql';
const app: express.Express = express();

// fake DB
let fakeDatabase: FakeDatabaseKeyType = {};
// fakeDatabaseのObject Key-Value型定義
interface PictureType {
  id: number,
  title: string,
  url: string,
  comment: string,
  createdAt: string,
  updatedAt: string,
  deletedAt?: string
}
interface FakeDatabaseKeyType {
  [id: string]: {
    id: string,
    name: string,
    pictures: Array<PictureType>
  }
}
fakeDatabase = {
  'a': {
    id: 'a',
    name: 'alice',
    pictures: [
      {
        id: 1,
        title: 'title1',
        url: 'url1',
        comment: 'comment1',
        createdAt: '2020-01-01 12:00:00',
        updatedAt: '2020-01-01 12:00:00'
      },
      {
        id: 2,
        title: 'title2',
        url: 'url2',
        comment: 'comment2',
        createdAt: '2020-01-01 12:00:00',
        updatedAt: '2020-01-01 12:00:00',
        deletedAt: '2020-01-01 12:00:00'
      },
    ]
  },
  'b': {
    id: 'b',
    name: 'bob',
    pictures: []
  },
};

/* スキーマ */
const pictureType = new GraphQLObjectType({
  name: 'picture',
  description: '写真スキーマ',
  fields: {
    id: { type: GraphQLInt },
    title: { type: GraphQLString },
    url: { type: GraphQLString },
    comment: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    deletedAt: { type: GraphQLString }
  }
})
const userType = new GraphQLObjectType({
  name: 'user',
  description: 'ユーザースキーマ 写真スキーマと1:多の関係',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    pictures: { type: GraphQLList(pictureType) }
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
      resolve: (_, { id }) => fakeDatabase[id]
    },
    users: {
      type: new GraphQLList(userType),
      resolve: _ => {
        return Object.keys(fakeDatabase).map(id => ({
          id,
          name: fakeDatabase[id].name,
          pictures: fakeDatabase[id].pictures
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
          name,
          pictures: []
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
          name: name,
          pictures: fakeDatabase[id].pictures
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
