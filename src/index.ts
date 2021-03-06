import * as express from 'express';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';

import UserController from './controllers/User';
import BookController from './controllers/Book';
import BookReviewController from './controllers/BookReview';

const app = express();
mongoose.connect('mongodb://paulo:pauloudacity@ds121960.mlab.com:21960/heroku_dhnprvlr');
// mongoose.connect('mongodb://localhost/myreads');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(morgan('dev'));

app.use('/users', UserController);
app.use('/books', BookController);
app.use('/reviews', BookReviewController);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`My Reads server listening port ${port}`);
});
