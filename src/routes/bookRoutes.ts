// bookRoutes.ts
import express from 'express';
import bookController from './../controllers/books.controller';
const router = express.Router();

router.post('/books', bookController.create);
router.get('/books', bookController.getAll);

export default router;
