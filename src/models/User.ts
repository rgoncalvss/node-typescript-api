import { Prisma, PrismaClient, User as PrismaUser } from "@prisma/client";
import { IUser } from "../interfaces/user.interface";

const prisma = new PrismaClient();

export class User {
  constructor() {}

  static async create(email: string, name: string): Promise<IUser | null> {
    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });
    return user;
  }

  static async update(user: IUser): Promise<IUser> {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: user,
    });
    return updatedUser;
  }

  static async findById(id: number): Promise<IUser | any> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { books: true },
    });

    return user;
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }
}
