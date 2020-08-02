import { GraphQLList, GraphQLInt } from "graphql";
import { UserType } from "../types";
import { FakeDatabaseKeyType } from "../types/fakeDatabase.type";

export class UsersQuery {
  protected fakeDatabase: FakeDatabaseKeyType = {}
  constructor (fakeDatabase: FakeDatabaseKeyType) {
    this.fakeDatabase = fakeDatabase
  }
  public type = new GraphQLList(UserType);
  public description: string = "List of all Users";
  public resolve = async () => {
    return Object.keys(this.fakeDatabase).map(id => ({
      id,
      name: this.fakeDatabase[id].name,
      pictures: this.fakeDatabase[id].pictures
    }))
  }
}
