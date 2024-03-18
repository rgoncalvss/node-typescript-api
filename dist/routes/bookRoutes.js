"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// bookRoutes.ts
const express_1 = __importDefault(require("express"));
const BookController_1 = require("./../controllers/BookController");
const error_handler_1 = require("../utils/error-handler");
const router = express_1.default.Router();
router.post('/books', (0, error_handler_1.errorHandler)(BookController_1.BookController.create));
router.patch('/books/:id/lend', (0, error_handler_1.errorHandler)(BookController_1.BookController.lend));
router.patch('/books/:id/return', (0, error_handler_1.errorHandler)(BookController_1.BookController.return));
exports.default = router;
