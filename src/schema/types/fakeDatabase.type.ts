export interface PictureType {
  id: number,
  title: string,
  url: string,
  comment: string,
  createdAt: string,
  updatedAt: string,
  deletedAt?: string
}
export interface FakeDatabaseKeyType {
  [id: string]: {
    id: string,
    name: string,
    pictures: Array<PictureType>
  }
}
