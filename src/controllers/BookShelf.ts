import { Router } from 'express';

import { Book } from '../schemas/Book';
import { BookShelf } from '../schemas/BookShelf';

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
    const shelf = await BookShelf.findOne({ book: req.params.bookId });
    const book = await Book.findOne({ id: req.params.bookId });

    res.send({ book, shelf });
  } catch (error) {
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

    const searchBook = await Book.findOne({ id: req.body.book.id });
    if (!searchBook) {
      const book = new Book();
      book.id = req.body.book.id;
      book.kind = req.body.book.kind;
      book.etag = req.body.book.etag;
      book.selfLink = req.body.book.selfLink;
      book.accessInfo = req.body.book.accessInfo;
      book.saleInfo = req.body.book.saleInfo;
      book.searchInfo = req.body.book.searchInfo;
      book.volumeInfo = req.body.book.volumeInfo;

      await book.save();
    }

    res.send({ id: bookShelf._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
