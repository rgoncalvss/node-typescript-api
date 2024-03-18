import { Request, Response } from "express";
import { BookController } from "../controllers/books.controller";
import { Book } from "../models/Book";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { NotFoundException } from "../exceptions/not-found";
import { User } from "../models/User";

jest.mock("../models/Book");
jest.mock("../models/User");

describe("BookController", () => {
  describe("create", () => {
    it("should create a new book when it doesn't exist already", async () => {
      const req = {
        body: {
          title: "New Book",
          content: "A book of old tales",
          available: true,
        },
      } as Request;
      const res = { json: jest.fn() } as unknown as Response;

      (Book.findByTitle as jest.Mock).mockResolvedValue(null);
      (Book.create as jest.Mock).mockResolvedValue({
        title: "New Book",
        content: "A book of old tales",
        available: true,
      });

      await BookController.create(req, res, jest.fn());

      expect(Book.create).toHaveBeenCalledWith({
        title: "New Book",
        content: "A book of old tales",
        available: true,
      });
      expect(res.json).toHaveBeenCalledWith({
        title: "New Book",
        content: "A book of old tales",
        available: true,
      });
    });

    it("should return a BadRequestException when the book already exists", async () => {
      const req: Request = {
        body: {
          title: "Existing Book",
          content: "A book of new tales",
          available: true,
        },
      } as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      (Book.findByTitle as jest.Mock).mockResolvedValue({
        title: "Existing Book",
        content: "A book of new tales",
        available: true,
      });

      await BookController.create(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new BadRequestException("Book already exists", ErrorCode.CONFLICT),
      );
    });
  });
});

describe("BookController", () => {
  describe("lend", () => {
    it("should lend a book when both book and user exist and the book is available", async () => {
      const req: Request = {
        params: { id: "1" },
        body: { userId: "1" },
      } as unknown as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;

      const bookMock = { id: 1, available: true };
      const userMock = { id: 1 };

      (Book.findById as jest.Mock).mockResolvedValue(bookMock);
      (User.findById as jest.Mock).mockResolvedValue(userMock);
      (Book.lend as jest.Mock).mockResolvedValue(bookMock);

      await BookController.lend(req, res, jest.fn());

      expect(Book.lend).toHaveBeenCalledWith(1, 1);
      expect(res.json).toHaveBeenCalledWith({ msg: "Book lent successfully!" });
    });

    it("should return a NotFoundException when the user is not found", async () => {
      const req: Request = {
        params: { id: "1" },
        body: { userId: "1" },
      } as unknown as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      (User.findById as jest.Mock).mockResolvedValue(null);

      await BookController.lend(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new NotFoundException("User not found", ErrorCode.NOT_FOUND),
      );
    });

    it("should return a NotFoundException when the book is not found", async () => {
      const req: Request = {
        params: { id: "1" },
        body: { userId: "1" },
      } as unknown as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      (User.findById as jest.Mock).mockResolvedValue({});
      (Book.findById as jest.Mock).mockResolvedValue(null);

      await BookController.lend(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new NotFoundException("Book not found", ErrorCode.NOT_FOUND),
      );
    });

    it("should return a BadRequestException when the book is not available", async () => {
      const req: Request = {
        params: { id: "1" },
        body: { userId: "1" },
      } as unknown as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      const bookMock = { id: 1, available: false };
      const userMock = { id: 1 };

      (User.findById as jest.Mock).mockResolvedValue(userMock);
      (Book.findById as jest.Mock).mockResolvedValue(bookMock);

      await BookController.lend(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new BadRequestException("Book already lent", ErrorCode.CONFLICT),
      );
    });
  });
});

describe("BookController", () => {
  describe("return", () => {
    it("should return a book when it exists and is not available", async () => {
      const req: Request = { params: { id: "1" } } as unknown as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;

      const bookMock = { id: 1, available: false };

      (Book.findById as jest.Mock).mockResolvedValue(bookMock);
      (Book.return as jest.Mock).mockResolvedValue(bookMock);

      await BookController.return(req, res, jest.fn());

      expect(Book.return).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Book returned successfully!",
      });
    });

    it("should return a NotFoundException when the book is not found", async () => {
      const req: Request = { params: { id: "1" } } as unknown as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      (Book.findById as jest.Mock).mockResolvedValue(null);

      await BookController.return(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new NotFoundException("Book not found", ErrorCode.NOT_FOUND),
      );
    });

    it("should return a BadRequestException when the book is already returned", async () => {
      const req: Request = { params: { id: "1" } } as unknown as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      const bookMock = { id: 1, available: true };

      (Book.findById as jest.Mock).mockResolvedValue(bookMock);

      await BookController.return(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new BadRequestException("Book already returned", ErrorCode.CONFLICT),
      );
    });
  });
});
