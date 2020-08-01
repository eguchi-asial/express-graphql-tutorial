import {
  GraphQLType,
  GraphQLString,
  GraphQLInt
} from 'graphql';

import { FakeDatabaseKeyType } from "../types/fakeDatabase.type";

export interface GraphQLMutation {
  type: GraphQLType;
  description: string;
  resolve: Function;
}

export class DeleteUserMutation implements GraphQLMutation {
  protected fakeDatabase: FakeDatabaseKeyType = {}
  constructor (fakeDatabase: FakeDatabaseKeyType) {
    this.fakeDatabase = fakeDatabase
  }
  public type = GraphQLInt;
  public description:string = "Delete user";
  public args = {
      id: { type: GraphQLString }
  };

  public resolve = (root: any, { id }: { [id: string]: string }) => {
    if (!id || !this.fakeDatabase[id]) throw new Error(`${id} does not exist`)
    delete this.fakeDatabase[id]
    console.log(this.fakeDatabase)
    // TODO deleteはGraphQLでは何返すべき？
    return 204
  }
}
