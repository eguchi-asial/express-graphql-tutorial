* ホストからnode単体

```
$npm install
$npm run start:dev
```

http://localhost:8080/

* docker単体

```
$docker build -t graphql-tutorial-api-server .
$docker run  -e API_ENV=dev -p 3000:8080 -d graphql-tutorial-api-server
```

http://localhost:3000/
