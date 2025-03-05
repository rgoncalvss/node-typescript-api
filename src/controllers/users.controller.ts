import { NextFunction, Request, Response } from 'express';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCode } from '../exceptions/root';
import { NotFoundException } from '../exceptions/not-found';
import usersRepository from '../repositories/UsersRepository';
import booksRepository from '../repositories/BooksRepository';

class UserController {
  async create(req: Request, res: Response, next: NextFunction) {
    const { email, name } = req.body;

    const userAlreadyExists = await usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      return next(
        new BadRequestException('User already exists', ErrorCode.CONFLICT),
      );
    }

    const user = await usersRepository.create(email, name);

    res.json(user).status(201);
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.id, 10);
    const user = await usersRepository.findById(userId);

    if (!user) {
      return next(new NotFoundException('User not found', ErrorCode.NOT_FOUND));
    }

    return res.json(user);
  }

  async lend(req: Request, res: Response, next: NextFunction) {
    const bookId = parseInt(req.body.id, 10);
    const userId = parseInt(req.params.userId, 10);

    if (!userId || !bookId) {
      return next(
        new BadRequestException(
          'Book and User Id are required',
          ErrorCode.BAD_REQUEST,
        ),
      );
    }

    const book = await booksRepository.findById(bookId);
    const user = await usersRepository.findById(userId);

    if (!user) {
      return next(new NotFoundException('User not found', ErrorCode.NOT_FOUND));
    }

    if (!book) {
      return next(new NotFoundException('Book not found', ErrorCode.NOT_FOUND));
    }

    if (!book.available) {
      return next(
        new BadRequestException('Book already lent', ErrorCode.CONFLICT),
      );
    }

    await booksRepository.update({
      where: { id: bookId },
      data: {
        available: false,
        customerId: userId,
      },
    });

    await usersRepository.update({
      where: { id: userId },
      data: {
        books: { connect: { id: bookId } },
      },
    });

    res.json({ msg: 'Book lent successfully!' });
  }

  async return(req: Request, res: Response, next: NextFunction) {
    const bookId = parseInt(req.params.id, 10);

    if (!bookId) {
      return next(
        new BadRequestException('Book Id is required', ErrorCode.BAD_REQUEST),
      );
    }

    const book = await booksRepository.findById(bookId);

    if (!book) {
      return next(new NotFoundException('Book not found', ErrorCode.NOT_FOUND));
    }

    if (book.available) {
      return next(
        new BadRequestException('Book already returned', ErrorCode.CONFLICT),
      );
    }

    if (!book.available) {
      await booksRepository.update({
        where: { id: bookId },
        data: {
          available: true,
          customerId: null,
        },
      });

      await usersRepository.update({
        where: { id: book.customerId },
        data: {
          books: { disconnect: { id: bookId } },
        },
      });
    }

    return res.json({ msg: 'Book returned successfully!' });
  }
}

//Singleton pattern
export default new UserController();
