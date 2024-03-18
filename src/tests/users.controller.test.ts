import { Request, Response } from "express";
import { UserController } from "../controllers/users.controller";
import { User } from "../models/User";
import { BadRequestException } from "../exceptions/bad-request";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

jest.mock("../models/User");

describe("UserController", () => {
  describe("create", () => {
    it("should create a new user when it doesn't exist already", async () => {
      const req: Request = {
        body: { email: "test@example.com", name: "Test User" },
      } as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;

      (User.findByEmail as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue({
        email: "test@example.com",
        name: "Test User",
      });

      await UserController.create(req, res, jest.fn());

      expect(User.create).toHaveBeenCalledWith("test@example.com", "Test User");
      expect(res.json).toHaveBeenCalledWith({
        email: "test@example.com",
        name: "Test User",
      });
    });

    it("should return a BadRequestException when the user already exists", async () => {
      const req: Request = {
        body: { email: "test@example.com", name: "Test User" },
      } as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      (User.findByEmail as jest.Mock).mockResolvedValue({
        email: "test@example.com",
        name: "Test User",
      });

      await UserController.create(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new BadRequestException("User already exists", ErrorCode.CONFLICT),
      );
    });
  });

  describe("findById", () => {
    it("should return the user when it exists", async () => {
      const req: Request = { params: { id: "1" } } as unknown as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;

      const userMock = { id: 1, email: "test@example.com", name: "Test User" };

      (User.findById as jest.Mock).mockResolvedValue(userMock);

      await UserController.findById(req, res, jest.fn());

      expect(res.json).toHaveBeenCalledWith(userMock);
    });

    it("should return a NotFoundException when the user is not found", async () => {
      const req: Request = { params: { id: "1" } } as unknown as Request;
      const res: Response = { json: jest.fn() } as unknown as Response;
      const next = jest.fn();

      (User.findById as jest.Mock).mockResolvedValue(null);

      await UserController.findById(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new NotFoundException("User not found", ErrorCode.NOT_FOUND),
      );
    });
  });
});
