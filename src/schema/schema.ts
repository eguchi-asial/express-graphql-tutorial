import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql';

import { UserQuery, UsersQuery } from './queries'
import { RegistUserMutation } from './mutations';
import { DeleteUserMutation } from './mutations/user.delete.mutation';

const fakeDatabase = {
  'a': {
    id: 'a',
    name: 'alice',
    pictures: [
      {
        id: 1,
        title: 'title1',
        url: 'https://example.com',
        comment: 'comment1',
        createdAt: '2020-01-01 12:00:00',
        updatedAt: '2020-01-01 12:00:00'
      },
      {
        id: 2,
        title: 'title2',
        url: 'https://example2.com',
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

class Query {
  public name = "Query";
  public fields = () => {
    return {
        user: new UserQuery(fakeDatabase),
        users: new UsersQuery(fakeDatabase)
    }
  }
}

class Mutation {
  public name = "Mutation";
  public fields = () => {
    return {
      registUser: new RegistUserMutation(fakeDatabase),
      deleteUser: new DeleteUserMutation(fakeDatabase)
    }
  }
}

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType(new Query()),
  mutation: new GraphQLObjectType(new Mutation())
});
