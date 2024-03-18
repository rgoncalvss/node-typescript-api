"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// userRoutes.ts
const express_1 = __importDefault(require("express"));
const UserController_1 = require("./../controllers/UserController");
const error_handler_1 = require("../utils/error-handler");
const userRouter = express_1.default.Router();
userRouter.get("/users/:id", (0, error_handler_1.errorHandler)(UserController_1.UserController.findById));
userRouter.post("/users", (0, error_handler_1.errorHandler)(UserController_1.UserController.create));
exports.default = userRouter;
