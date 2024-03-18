// bookRoutes.ts
import express from "express";
import { BookController } from "./../controllers/books.controller";
//import { errorHandler } from "../utils/error-handler";

const router = express.Router();

router.post("/books", BookController.create);
router.patch("/books/:id/lend", BookController.lend);
router.patch("/books/:id/return", BookController.return);

export default router;
