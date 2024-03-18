import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { NotFoundException } from "../exceptions/not-found";

export class UserController {
  static async create(req: Request, res: Response, next: NextFunction) {
    const { email, name } = req.body;

    const userAlreadyExists = await User.findByEmail(email);

    if (userAlreadyExists) {
      next(new BadRequestException("User already exists", ErrorCode.CONFLICT));
      return;
    }

    const user = await User.create(email, name);

    res.json(user);
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.id, 10);
    const user = await User.findById(userId);

    if (!user) {
      next(new NotFoundException("User not found", ErrorCode.NOT_FOUND));
      return;
    }

    return res.json(user);
  }
}
