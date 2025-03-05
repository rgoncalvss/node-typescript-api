// Book.ts
import { Prisma, PrismaClient } from '@prisma/client';
import { IBook } from '../interfaces/book.interface';

const prisma = new PrismaClient();

export class BooksRepository {
  async create(bookToSave: IBook) {
    const book = await prisma.book.create({
      data: { ...bookToSave, available: true },
    });

    return book;
  }

  async return(bookId: number) {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    return book;
  }

  async update(query: Prisma.BookUpdateArgs) {
    const updatedBook = await prisma.book.update(query);

    return updatedBook;
  }

  async getAll() {
    const books = await prisma.book.findMany();

    return books;
  }

  async findById(bookId: number) {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    return book;
  }

  async findByTitle(title: string) {
    const book = await prisma.book.findUnique({
      where: { title },
    });

    return book;
  }
}

export default new BooksRepository();
