import { Router } from 'express';

import { Book } from '../schemas/Book';
import { User } from '../schemas/User';
import { BookShelf } from '../schemas/BookShelf';
import { BookReview } from '../schemas/BookReview';

const router = Router();

router.route('/:userId/books').get(async (req, res) => {
  try {
    const shelves = await BookShelf.find({ user: req.params.userId });

    const bookIds = [];
    shelves.forEach(bookShelf => {
      bookIds.push(bookShelf.book);
    });

    const books = await Book.find({ id: { $in: bookIds } });

    res.send({ books });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.route('/:userId/shelves').get(async (req, res) => {
  try {
    const shelves = await BookShelf.find({ user: req.params.userId });

    res.send({ shelves });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.route('/:bookId').get(async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.bookId });
    const shelf = await BookShelf.findOne({ book: req.params.bookId });
    const reviews = await BookReview.find({ book: req.params.bookId })
      .populate('user')
      .sort('-date');

    let rating = 0;
    if (reviews && reviews.length > 0) {
      rating = reviews.map(review => review.rating).reduce((previousValue, currentValue) => (previousValue += currentValue));
      rating /= reviews.length;
    }

    res.send({ book, shelf, reviews, rating });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.route('/').post(async (req, res) => {
  try {
    let bookShelf = await BookShelf.findOne({ user: req.body.user, book: req.body.book.id });
    if (!bookShelf) {
      bookShelf = new BookShelf();
    }

    bookShelf.user = req.body.user;
    bookShelf.book = req.body.book.id;
    bookShelf.shelf = req.body.shelf;
    bookShelf.date = new Date();
    await bookShelf.save();
    await saveBook(req.body.book);

    res.send({ id: bookShelf._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.route('/books').post(async (req, res) => {
  try {
    req.body.books.forEach(saveBook);

    res.sendStatus(200);
  } catch (error) {
    res.status(400).send(error);
  }
});

const saveBook = async book => {
  const searchBook = await Book.findOne({ id: book.id });
  if (!searchBook) {
    const newBook = new Book();
    newBook.id = book.id;
    newBook.kind = book.kind;
    newBook.etag = book.etag;
    newBook.selfLink = book.selfLink;
    newBook.accessInfo = book.accessInfo;
    newBook.saleInfo = book.saleInfo;
    newBook.searchInfo = book.searchInfo;
    newBook.volumeInfo = book.volumeInfo;

    await newBook.save();
  }
};

export default router;
