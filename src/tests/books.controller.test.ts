import { Request, Response } from 'express';
import booksController from '../controllers/books.controller';
import booksRepository from '../repositories/BooksRepository';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCode } from '../exceptions/root';

jest.mock('../repositories/UsersRepository');
jest.mock('../repositories/BooksRepository');

describe('BookController', () => {
  describe('create', () => {
    it('should create a new book when it doesnt exist already', async () => {
      const req = {
        body: {
          title: 'New Book',
          content: 'A book of old tales',
          available: true,
        },
      } as Request;
      const res = { json: jest.fn() } as unknown as Response;

      (booksRepository.findByTitle as jest.Mock).mockResolvedValue(null);
      (booksRepository.create as jest.Mock).mockResolvedValue({
        title: 'New Book',
        content: 'A book of old tales',
        available: true,
      });

      await booksController.create(req, res, jest.fn());

      expect(booksRepository.create).toHaveBeenCalledWith({
        title: 'New Book',
        content: 'A book of old tales',
        available: true,
      });
      expect(res.json).toHaveBeenCalledWith({
        title: 'New Book',
        content: 'A book of old tales',
        available: true,
      });
    });

    it('should return a BadRequestException when the book already exists', async () => {
      const req: Request = {
        body: {
          title: 'Existing Book',
          content: 'A book of new tales',
          available: true,
        },
      } as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      (booksRepository.findByTitle as jest.Mock).mockResolvedValue({
        title: 'Existing Book',
        content: 'A book of new tales',
        available: true,
      });

      await booksController.create(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new BadRequestException('Book already exists', ErrorCode.CONFLICT),
      );
    });
  });
});
