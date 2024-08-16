import express from 'express';

import messageController from '../controllers/message.controller.js';

const router = express.Router();

router.post('/getmsg', messageController.getMessages);
router.post('/addmsg', messageController.sendMessage);

export default router;