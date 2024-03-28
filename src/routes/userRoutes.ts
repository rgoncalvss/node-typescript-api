import express from 'express';
import usersController from '../controllers/users.controller';

const router = express.Router();

router.get('/users/:id', usersController.findById);
router.post('/users', usersController.create);
router.patch('/users/:id/lend', usersController.lend);
router.patch('/users/:id/return', usersController.return);

export default router;
