import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from "graphql";
import { PictureType } from "./picture.type";

class User {
  public name: string = 'user_schama';
  public fields = () => {
    return {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      pictures: {
        type: GraphQLList(PictureType),
        args: {
          first!: { type: GraphQLInt },
          last!: { type: GraphQLInt }
        }
      }
    }
  }
}
export const UserType = new GraphQLObjectType(new User());
