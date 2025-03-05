import { Request, Response } from 'express';
import usersController from '../controllers/users.controller';
import usersRepository from '../repositories/UsersRepository';
import booksRepository from '../repositories/BooksRepository';
import { BadRequestException } from '../exceptions/bad-request';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';

jest.mock('../repositories/UsersRepository');
jest.mock('../repositories/BooksRepository');

describe('usersController', () => {
  describe('create', () => {
    it('should create a new user when it doesnt exist already', async () => {
      const req: Request = {
        body: { email: 'test@example.com', name: 'Test User' },
      } as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;

      (usersRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersRepository.create as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        name: 'Test User',
      });

      await usersController.create(req, res, jest.fn());

      expect(usersRepository.create).toHaveBeenCalledWith('test@example.com', 'Test User');
      expect(res.json).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    it('should return a BadRequestException when the user already exists', async () => {
      const req: Request = {
        body: { email: 'test@example.com', name: 'Test User' },
      } as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      (usersRepository.findByEmail as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        name: 'Test User',
      });

      await usersController.create(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new BadRequestException('User already exists', ErrorCode.CONFLICT),
      );
    });
  });

  describe('findById', () => {
    it('should return the user when it exists', async () => {
      const req: Request = { params: { id: '1' } } as unknown as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;

      const userMock = { id: 1, email: 'test@example.com', name: 'Test User' };

      (usersRepository.findById as jest.Mock).mockResolvedValue(userMock);

      await usersController.findById(req, res, jest.fn());

      expect(res.json).toHaveBeenCalledWith(userMock);
    });

    it('should return a NotFoundException when the user is not found', async () => {
      const req: Request = { params: { id: '1' } } as unknown as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      (usersRepository.findById as jest.Mock).mockResolvedValue(null);

      await usersController.findById(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new NotFoundException('User not found', ErrorCode.NOT_FOUND),
      );
    });
  });

  describe('lend', () => {
    it('should lend a book when both book and user exist and the book is available', async () => {
      const req: Request = {
        params: { userId: '1' },
        body: { id: '1' },
      } as unknown as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;

      const bookMock = { id: 1, available: true };
      const userMock = { id: 1 };

      (booksRepository.findById as jest.Mock).mockResolvedValue(bookMock);
      (usersRepository.findById as jest.Mock).mockResolvedValue(userMock);
      (usersRepository.update as jest.Mock).mockResolvedValue(userMock);
      (booksRepository.update as jest.Mock).mockResolvedValue(bookMock);

      await usersController.lend(req, res, jest.fn());

      expect(res.json).toHaveBeenCalledWith({
        msg: 'Book lent successfully!',
      });
    });

    it('should return a NotFoundException when the user is not found', async () => {
      const req: Request = {
        params: { userId: '1' },
        body: { id: '1' },
      } as unknown as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      (usersRepository.findById as jest.Mock).mockResolvedValue(null);

      await usersController.lend(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new NotFoundException('User not found', ErrorCode.NOT_FOUND),
      );
    });

    it('should return a NotFoundException when the book is not found', async () => {
      const req: Request = {
        params: { userId: '1' },
        body: { id: '1' },
      } as unknown as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      (usersRepository.findById as jest.Mock).mockResolvedValue({});
      (booksRepository.findById as jest.Mock).mockResolvedValue(null);

      await usersController.lend(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new NotFoundException('Book not found', ErrorCode.NOT_FOUND),
      );
    });

    it('should return a BadRequestException when the book is not available', async () => {
      const req: Request = {
        params: { userId: '1' },
        body: { id: '1' },
      } as unknown as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      const bookMock = { id: 1, available: false };
      const userMock = { id: 1 };

      (usersRepository.findById as jest.Mock).mockResolvedValue(userMock);
      (booksRepository.findById as jest.Mock).mockResolvedValue(bookMock);

      await usersController.lend(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new BadRequestException('Book already lent', ErrorCode.CONFLICT),
      );
    });
  });

  describe('return', () => {
    it('should return a book when it exists and is not available', async () => {
      const req: Request = { params: { id: '1' } } as unknown as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;

      const bookMock = { id: 1, available: false };

      (booksRepository.findById as jest.Mock).mockResolvedValue(bookMock);
      (booksRepository.return as jest.Mock).mockResolvedValue(bookMock);

      await usersController.return(req, res, jest.fn());

      expect(res.json).toHaveBeenCalledWith({
        msg: 'Book returned successfully!',
      });
    });

    it('should return a NotFoundException when the book is not found', async () => {
      const req: Request = { params: { id: '1' } } as unknown as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      (booksRepository.findById as jest.Mock).mockResolvedValue(null);

      await usersController.return(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new NotFoundException('Book not found', ErrorCode.NOT_FOUND),
      );
    });

    it('should return a BadRequestException when the book is already returned', async () => {
      const req: Request = { params: { id: '1' } } as unknown as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      const bookMock = { id: 1, available: true };

      (booksRepository.findById as jest.Mock).mockResolvedValue(bookMock);

      await usersController.return(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new BadRequestException('Book already returned', ErrorCode.CONFLICT),
      );
    });
  });
});
