'use strict';

import express, { NextFunction, Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { specifiedRules } from 'graphql';
import { schema } from './schema/schema';
const app: express.Express = express();

// body-parserに基づいた着信リクエストの解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware
// request
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('ip:', req.ip);
  next();
})
// response
// CORSの許可
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
  validationRules: [...specifiedRules]
}));
app.listen(8080, ()=>{ console.log('Example app listening on port 8080!') });
