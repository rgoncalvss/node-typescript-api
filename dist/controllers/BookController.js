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
exports.BookController = void 0;
const Book_1 = require("../models/Book");
const bad_request_1 = require("../exceptions/bad-request");
const root_1 = require("../exceptions/root");
const not_found_1 = require("../exceptions/not-found");
class BookController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookAlreadyExists = yield Book_1.Book.findByTitle(req.body.title);
            if (bookAlreadyExists) {
                next(new bad_request_1.BadRequestException("Book already exists", root_1.ErrorCode.CONFLICT));
                return;
            }
            const book = yield Book_1.Book.create(req.body);
            res.json(book);
        });
    }
    static lend(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookId = parseInt(req.params.id, 10);
                const userId = parseInt(req.body.userId, 10);
                const book = yield Book_1.Book.findById(bookId);
                // const user = await User.findById(userId);
                // console.log(user);
                // if (!user) {
                //   next(new NotFoundException("User not found", ErrorCode.NOT_FOUND));
                //   return;
                // }
                if (!book) {
                    next(new not_found_1.NotFoundException("Book not found", root_1.ErrorCode.NOT_FOUND));
                    return;
                }
                if (!book.available) {
                    next(new bad_request_1.BadRequestException("Book already lent", root_1.ErrorCode.CONFLICT));
                    return;
                }
                const result = yield Book_1.Book.lend(bookId, userId);
                res.json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static return(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookId = parseInt(req.params.id, 10);
            const book = yield Book_1.Book.findById(bookId);
            if (!book) {
                next(new not_found_1.NotFoundException("Book not found", root_1.ErrorCode.NOT_FOUND));
                return;
            }
            if (book.available) {
                next(new bad_request_1.BadRequestException("Book already returned", root_1.ErrorCode.CONFLICT));
                return;
            }
            yield Book_1.Book.return(bookId);
            res.json(book);
        });
    }
}
exports.BookController = BookController;
