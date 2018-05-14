import { Router } from 'express';

import { Book } from '../schemas/Book';
import { BookReview } from '../schemas/BookReview';

const router = Router();

router.route('/').post(async (req, res) => {
  try {
    const newBookReview = new BookReview();
    newBookReview.user = req.body.user;
    newBookReview.book = req.body.book;
    newBookReview.rating = req.body.rating;
    newBookReview.text = req.body.text;
    newBookReview.date = new Date();

    await newBookReview.save();

    res.send({ id: newBookReview._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
