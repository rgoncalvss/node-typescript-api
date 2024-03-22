import express from 'express';
import usersController from '../controllers/users.controller';

const router = express.Router();

router.get('/users/:id', usersController.findById);
router.post('/users', usersController.create);

export default router;
