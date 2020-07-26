import {
  GraphQLType,
  GraphQLNonNull,
  GraphQLString
} from 'graphql';

import { UserType } from '../types'
import { FakeDatabaseKeyType } from "../types/fakeDatabase.type";

export interface GraphQLMutation {
  type: GraphQLType;
  description: string;
  resolve: Function;
}

export class RegistUserMutation implements GraphQLMutation {
  protected fakeDatabase: FakeDatabaseKeyType = {}
  constructor (fakeDatabase: FakeDatabaseKeyType) {
    this.fakeDatabase = fakeDatabase
  }
  public type = UserType;
  public description:string = "Regist new user";
  public args = {
      name: { type: GraphQLString }
  };

  public resolve = (root: any, { name }: { [name: string]: string }) => {
    if (!name) throw new Error('name is required')
    const id = require('crypto').randomBytes(10).toString('hex');
    this.fakeDatabase[id] = {
      id,
      name,
      pictures: []
    };
    return this.fakeDatabase[id]
  }
}
