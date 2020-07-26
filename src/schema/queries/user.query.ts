import { GraphQLList, GraphQLString } from "graphql";
import { UserType } from "../types";
import { FakeDatabaseKeyType } from "../types/fakeDatabase.type";

export class UserQuery {
  protected fakeDatabase: FakeDatabaseKeyType = {}
  constructor (fakeDatabase: FakeDatabaseKeyType) {
    this.fakeDatabase = fakeDatabase
  }
  public type = UserType;
  public description: string = "Retun User by id";
  public args = { id: { type: GraphQLString } };
  public resolve = (root: any, { id }: { [id: string]: string }) => {
    console.log(this.fakeDatabase[id])
    return this.fakeDatabase[id]
  }
}
