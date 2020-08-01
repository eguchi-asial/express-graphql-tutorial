import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql';

import { UserQuery, UsersQuery } from './queries';
import { RegistUserMutation, DeleteUserMutation, MassRegistUserMutation } from './mutations';
import { fakeDatabase } from './fakeDatabase';

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
      deleteUser: new DeleteUserMutation(fakeDatabase),
      testMassUsers: new MassRegistUserMutation(fakeDatabase)
    }
  }
}

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType(new Query()),
  mutation: new GraphQLObjectType(new Mutation())
});
