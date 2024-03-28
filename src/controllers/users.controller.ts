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
      next(new BadRequestException('User already exists', ErrorCode.CONFLICT));
      return;
    }

    const user = await usersRepository.create(email, name);

    res.json(user);
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.id, 10);
    const user = await usersRepository.findById(userId);

    if (!user) {
      next(new NotFoundException('User not found', ErrorCode.NOT_FOUND));
      return;
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

    res.send({ msg: 'Book lent successfully!' });
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

    return res.send({ msg: 'Book returned successfully!' });
  }
}

//Singleton pattern
export default new UserController();
