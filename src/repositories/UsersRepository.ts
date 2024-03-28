import { Prisma, PrismaClient } from '@prisma/client';
import { IUser } from '../interfaces/user.interface';

const prisma = new PrismaClient();

export class UsersRepository {
  async create(email: string, name: string): Promise<IUser | null> {
    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });
    return user;
  }

  async update(query: Prisma.UserUpdateArgs): Promise<IUser> {
    const updatedUser = await prisma.user.update(query);
    return updatedUser;
  }

  async findById(id: number): Promise<IUser | any> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { books: true },
    });

    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }
}

export default new UsersRepository();
