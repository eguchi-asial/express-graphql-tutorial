* node単体

```
$npm install
$npm run start:dev
```

* docker単体(srcをコピーしてしまうので、nodemonは有効にならない)

```
$docker build -t graphql-tutorial-api-server .
$docker run  -e API_ENV=dev -p 3000:8080 -d graphql-tutorial-api-server
```
