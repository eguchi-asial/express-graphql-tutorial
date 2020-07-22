'use strict';

import express from 'express';

const app: express.Express = express();

// body-parserに基づいた着信リクエストの解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORSの許可
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// GetとPostのルーティング
const router: express.Router = express.Router();

router.get('/', (req:express.Request, res:express.Response) => {
  res.send({
    message: 'this is GET'
  });
});

router.post('/', (req: express.Request, res: express.Response) => {
  res.send({
    result: 'this is POST'
  });
})

app.use(router);
app.listen(8080,()=>{ console.log('Example app listening on port 8080!') });
