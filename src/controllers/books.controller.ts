import { NextFunction, Request, Response } from 'express';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCode } from '../exceptions/root';
import { NotFoundException } from '../exceptions/not-found';
import booksRepository from '../repositories/BooksRepository';
import usersRepository from '../repositories/UsersRepository';

class BookController {
  async create(req: Request, res: Response, next: NextFunction) {
    const { title, available } = req.body;

    if (!title || !available) {
      next(
        new BadRequestException(
          'Title and book availability are required',
          ErrorCode.BAD_REQUEST,
        ),
      );
      return;
    }

    const bookAlreadyExists = await booksRepository.findByTitle(req.body.title);

    if (bookAlreadyExists) {
      next(new BadRequestException('Book already exists', ErrorCode.CONFLICT));
      return;
    }

    const book = await booksRepository.create(req.body);

    res.json(book);
  }

  async getAll(req: Request, res: Response) {
    const books = await booksRepository.getAll();
    res.json(books);
  }

  async lend(req: Request, res: Response, next: NextFunction) {
    const bookId = parseInt(req.params.id, 10);
    const userId = parseInt(req.body.userId, 10);

    if (!userId || !bookId) {
      next(
        new BadRequestException(
          'Book and User Id are required',
          ErrorCode.BAD_REQUEST,
        ),
      );
      return;
    }

    const book = await booksRepository.findById(bookId);
    const user = await usersRepository.findById(userId);

    if (!user) {
      next(new NotFoundException('User not found', ErrorCode.NOT_FOUND));
      return;
    }

    if (!book) {
      next(new NotFoundException('Book not found', ErrorCode.NOT_FOUND));
      return;
    }

    if (!book.available) {
      next(new BadRequestException('Book already lent', ErrorCode.CONFLICT));
      return;
    }

    await booksRepository.lend(bookId, userId);

    res.json({ msg: 'Book lent successfully!' });
  }

  async return(req: Request, res: Response, next: NextFunction) {
    const bookId = parseInt(req.params.id, 10);

    if (!bookId) {
      next(
        new BadRequestException('Book Id is required', ErrorCode.BAD_REQUEST),
      );
      return;
    }

    const book = await booksRepository.findById(bookId);

    if (!book) {
      next(new NotFoundException('Book not found', ErrorCode.NOT_FOUND));
      return;
    }

    if (book.available) {
      next(
        new BadRequestException('Book already returned', ErrorCode.CONFLICT),
      );
      return;
    }

    await booksRepository.return(bookId);

    res.json({ msg: 'Book returned successfully!' });
  }
}

// Singleton pattern
export default new BookController();
