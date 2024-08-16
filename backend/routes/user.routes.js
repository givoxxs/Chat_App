import express from 'express';
import userController from '../controllers/user.controller.js';
import { verifyTokenAndAdmin } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

router.get('/:id', userController.getAllUsers);
router.get('/find/:id', userController.getUserById);
router.post('/setAvatar/:id', userController.setAvatar);

export default router;