import * as express from 'express';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';

import UserController from './controllers/User';

const app = express();
mongoose.connect('mongodb://localhost/myreads');

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/users', UserController);

app.listen(3000, () => {
  console.log('MyReads listening on port 3000!');
});
