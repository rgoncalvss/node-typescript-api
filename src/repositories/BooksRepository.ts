// Book.ts
import { Book, Prisma, PrismaClient } from '@prisma/client';
import { IBook } from '../interfaces/book.interface';

const prisma = new PrismaClient();

export class BooksRepository {
  async create(bookToSave: IBook): Promise<IBook | any> {
    const book = await prisma.book.create({
      data: { ...bookToSave, available: true },
    });
    return book;
  }

  async return(bookId: number): Promise<Book | null> {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    return book;
  }

  async update(query: Prisma.BookUpdateArgs): Promise<IBook | any> {
    const updatedBook = await prisma.book.update(query);
    return updatedBook;
  }

  async getAll() {
    const books = await prisma.book.findMany();
    return books;
  }

  async findById(bookId: number): Promise<IBook | any> {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    return book;
  }

  async findByTitle(title: string): Promise<IBook | any> {
    const book = await prisma.book.findUnique({
      where: { title },
    });
    return book;
  }
}

export default new BooksRepository();
