export const fakeDatabase = {
  'a': {
    id: 'a',
    name: 'alice',
    pictures: [
      {
        id: 1,
        title: 'title1',
        url: 'https://example.com',
        comment: 'comment1',
        createdAt: '2020-01-01 12:00:00',
        updatedAt: '2020-01-01 12:00:00'
      },
      {
        id: 2,
        title: 'title2',
        url: 'https://example2.com',
        comment: 'comment2',
        createdAt: '2020-01-01 12:00:00',
        updatedAt: '2020-01-01 12:00:00',
        deletedAt: '2020-01-01 12:00:00'
      },
    ]
  },
  'b': {
    id: 'b',
    name: 'bob',
    pictures: []
  }
}
