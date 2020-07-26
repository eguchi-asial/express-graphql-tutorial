import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";

class Picture {
  public name: string = 'picture_schema';
  public fields = () => {
    return {
      id: { type: GraphQLInt },
      title: { type: GraphQLString },
      url: { type: GraphQLString },
      comment: { type: GraphQLString },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString },
      deletedAt: { type: GraphQLString }
    }
  }
}
export const PictureType = new GraphQLObjectType(new Picture());
