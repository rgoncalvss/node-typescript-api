import { Request, Response } from 'express';
import usersController from '../controllers/users.controller';
import usersRepository from '../repositories/UsersRepository';
import { BadRequestException } from '../exceptions/bad-request';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';

jest.mock('../repositories/UsersRepository');

describe('usersController', () => {
  describe('create', () => {
    it("should create a new user when it doesn't exist already", async () => {
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

      expect(usersRepository.create).toHaveBeenCalledWith(
        'test@example.com',
        'Test User',
      );
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
});
