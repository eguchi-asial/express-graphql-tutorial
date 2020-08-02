import { GraphQLList, GraphQLInt } from "graphql";
import { UserType } from "../types";
import { FakeDatabaseKeyType } from "../types/fakeDatabase.type";
import { GraphQLQuery } from "./query.interface";

export class UsersQuery implements GraphQLQuery {
  protected fakeDatabase: FakeDatabaseKeyType = {}
  constructor (fakeDatabase: FakeDatabaseKeyType) {
    this.fakeDatabase = fakeDatabase
  }
  public type = new GraphQLList(UserType);
  public description: string = "List of all Users";
  public resolve = () => {
    // TODO userスキーマのpictureに指定したargs(firstとか)どうやって取得すんの？
    // 上記が解決したら、cursor、edge、nodeの実装に移る
    return Object.keys(this.fakeDatabase).map(id => {
      const fakeDatabase = this.fakeDatabase
      return {
        id,
        name: fakeDatabase[id].name,
        pictures: fakeDatabase[id].pictures
      }
    })
  }
}
