import { NextFunction, Request, Response } from 'express';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCode } from '../exceptions/root';
import { NotFoundException } from '../exceptions/not-found';
import usersRepository from '../repositories/UsersRepository';
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
}

//Singleton pattern
export default new UserController();
