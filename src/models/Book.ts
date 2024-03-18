// Book.ts
import { PrismaClient, Book as PrismaBook } from "@prisma/client";
import { IBook } from "../interfaces/book.interface";

const prisma = new PrismaClient();

export class Book {
  constructor(private prismaBook: PrismaBook) {}

  static async create(bookToSave: IBook): Promise<IBook | any> {
    const book = await prisma.book.create({
      data: { ...bookToSave, available: true },
    });
    return book;
  }

  static async lend(bookId: number, userId: number): Promise<void> {
    await prisma.book.update({
      where: { id: bookId },
      data: {
        available: false,
        customerId: userId,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        books: { connect: { id: bookId } },
      },
    });
  }

  static async return(bookId: number): Promise<IBook | any> {
    const book = (await prisma.book.findUnique({
      where: { id: bookId },
    })) as IBook;

    if (!book.available) {
      const updatedBook = await prisma.book.update({
        where: { id: bookId },
        data: {
          available: true,
          customerId: null,
        },
      });

      await prisma.user.update({
        where: { id: book.customerId },
        data: {
          books: { disconnect: { id: bookId } },
        },
      });

      return updatedBook;
    }
    return null;
  }

  async update(): Promise<IBook> {
    const updatedBook = (await prisma.book.update({
      where: { id: this.prismaBook.id },
      data: this.prismaBook,
    })) as IBook;
    return updatedBook;
  }

  static async findById(bookId: number): Promise<IBook | any> {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });
    if (!book) {
      return { msg: "Book not found" };
    }
    return book;
  }

  static async findByTitle(title: string): Promise<IBook | any> {
    const book = await prisma.book.findUnique({
      where: { title },
    });
    if (!book) {
      return { msg: "Book not found" };
    }
    return book;
  }
}
