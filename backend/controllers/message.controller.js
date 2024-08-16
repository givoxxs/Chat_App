import Message from '../models/Message.js';

class MessageController {
    async getMessages(req, res, next) {
        try {
            const { from , to } = req.body;

            const messages = await Message.find({
                users: {
                    $all: [from, to],
                },
            }).sort({ updatedAt: 1 });

            const projectMessages = messages.map((msg) => {
                return {
                    fromSelf : msg.sender.toString() === from,
                    message: msg.message.text,  // Sửa lỗi truy cập thuộc tính message
                };
            });
            res.json(projectMessages);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }

    async sendMessage(req, res, next) {
        const { from, to, message } = req.body;
        try {
            const newMessage = new Message({
                users: [from, to],
                message: {
                    text: message,  // Đảm bảo thuộc tính text được gán đúng
                },
                sender: from,
            });
            const savedMessage = await newMessage.save();
            if (!savedMessage) {
                return res.status(400).json({ 
                    msg: 'Message not sent' ,
                    status: false,
                });
            }
            res.json({
                msg: "Message added successfully."
            });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }
};

export default new MessageController();
