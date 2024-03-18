"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
// Book.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class Book {
    constructor(prismaBook) {
        this.prismaBook = prismaBook;
    }
    static create(bookToSave) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield prisma.book.create({
                data: Object.assign(Object.assign({}, bookToSave), { available: true }),
            });
            return book;
        });
    }
    static lend(bookId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.book.update({
                where: { id: bookId },
                data: {
                    available: false,
                    customerId: userId,
                },
            });
            yield prisma.user.update({
                where: { id: userId },
                data: {
                    books: { connect: { id: bookId } },
                },
            });
        });
    }
    static return(bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = (yield prisma.book.findUnique({
                where: { id: bookId },
            }));
            if (!book.available) {
                const updatedBook = yield prisma.book.update({
                    where: { id: bookId },
                    data: {
                        available: true,
                        customerId: null,
                    },
                });
                yield prisma.user.update({
                    where: { id: book.customerId },
                    data: {
                        books: { disconnect: { id: bookId } },
                    },
                });
                return updatedBook;
            }
            return null;
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedBook = (yield prisma.book.update({
                where: { id: this.prismaBook.id },
                data: this.prismaBook,
            }));
            return updatedBook;
        });
    }
    static findById(bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield prisma.book.findUnique({
                where: { id: bookId },
            });
            if (!book) {
                return { msg: "Book not found" };
            }
            return book;
        });
    }
    static findByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield prisma.book.findUnique({
                where: { title },
            });
            if (!book) {
                return { msg: "Book not found" };
            }
            return book;
        });
    }
}
exports.Book = Book;
