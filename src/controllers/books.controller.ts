import { NextFunction, Request, Response } from 'express';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCode } from '../exceptions/root';
import booksRepository from '../repositories/BooksRepository';

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

    return res.json(book);
  }

  async getAll(req: Request, res: Response) {
    const books = await booksRepository.getAll();
    return res.json(books);
  }
}

// Singleton pattern
export default new BookController();
