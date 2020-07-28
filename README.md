* ホストからnode単体

```
$npm install
$npm run start:dev
```

http://localhost:8080/graphql

* docker単体

```
$docker build -t graphql-tutorial-api-server .
$docker run  -e API_ENV=dev -p 3000:8080 -d graphql-tutorial-api-server
```

http://localhost:3000/graphql

* クエリ例

- 全ユーザー

```
{
  users {
    id,
    name,
    pictures {
      id,
      title,
      url
    }
  }
}
```

- ユーザ追加

```
mutation {
  registUser(name: "taro") {
    id
  }
}
```