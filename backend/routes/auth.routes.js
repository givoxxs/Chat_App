import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout/:id', authController.logout);

export default router;