// bookRoutes.ts
import express from 'express';
import bookController from './../controllers/books.controller';
const router = express.Router();

router.post('/books', bookController.create);
router.patch('/books/:id/lend', bookController.lend);
router.patch('/books/:id/return', bookController.return);
router.get('/books', bookController.getAll);

export default router;
