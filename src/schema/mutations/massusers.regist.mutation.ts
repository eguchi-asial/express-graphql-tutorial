import {
  GraphQLType,
  GraphQLInt,
  GraphQLList
} from 'graphql';

import { UserType } from '../types'
import { FakeDatabaseKeyType, PictureType } from "../types/fakeDatabase.type";

export interface GraphQLMutation {
  type: GraphQLType;
  description: string;
  resolve: Function;
}

export class MassRegistUserMutation implements GraphQLMutation {
  protected fakeDatabase: FakeDatabaseKeyType = {}
  constructor (fakeDatabase: FakeDatabaseKeyType) {
    this.fakeDatabase = fakeDatabase
  }
  public type = new GraphQLList(UserType);
  public description:string = "Regist new user";
  public args = {
      size: { type: GraphQLInt }
  };

  public resolve = (root: any, { size = 100 }: { [size: string]: number }) => {
    const registeredIds = []
    const pictures: Array<PictureType> = []
    const crypto = require('crypto')
    for (let i = 0; i< 100; i++) {
      pictures.push({
        id: i + 100,
        title: crypto.randomBytes(10).toString('hex'),
        url: `url_${i + 1}`,
        comment: `comment_${i + 1}`,
        createdAt: '2020-01-01 12:00:00',
        updatedAt: '2020-01-01 12:00:00'
      })
    }
    for (let i = 0; i < size; i++) {
      const id = crypto.randomBytes(10).toString('hex');
      const name = `name_${id}`
      this.fakeDatabase[id] = {
        id,
        name,
        pictures
      };
      registeredIds.push(id)
    }
    return registeredIds.map(id => ({
      id,
      name: this.fakeDatabase[id].name,
      pictures: this.fakeDatabase[id].pictures
    }))
  }
}
