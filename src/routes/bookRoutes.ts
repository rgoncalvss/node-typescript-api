// bookRoutes.ts
import { Router } from 'express';
import bookController from './../controllers/books.controller';
const router = Router();

router.post('/books', bookController.create);
router.get('/books', bookController.getAll);

export default router;
