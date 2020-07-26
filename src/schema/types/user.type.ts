import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import { PictureType } from "./picture.type";

class User {
  public name: string = 'user_schama';
  public fields = () => {
    return {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      pictures: { type: GraphQLList(PictureType) }
    }
  }
}
export const UserType = new GraphQLObjectType(new User());
