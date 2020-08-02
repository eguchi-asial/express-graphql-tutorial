import { GraphQLType } from "graphql";

export interface GraphQLMutation {
  type: GraphQLType;
  description: string;
  resolve: Function;
}
