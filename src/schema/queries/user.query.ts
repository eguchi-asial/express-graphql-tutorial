import { GraphQLList, GraphQLString } from "graphql";
import { UserType } from "../types";
import { FakeDatabaseKeyType } from "../types/fakeDatabase.type";
import { GraphQLQuery } from "./query.interface";

export class UserQuery implements GraphQLQuery {
  protected fakeDatabase: FakeDatabaseKeyType = {}
  constructor (fakeDatabase: FakeDatabaseKeyType) {
    this.fakeDatabase = fakeDatabase
  }
  public type = UserType;
  public description: string = "Retun User by id";
  public args = { id: { type: GraphQLString } };
  public resolve = (root: any, { id }: { [id: string]: string }) => this.fakeDatabase[id]
}
