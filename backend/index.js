import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import http from 'http';

import au from './routes/auth.routes.js';
import user from './routes/user.routes.js';
import msg from './routes/msg.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log('MongoDB Connection Success');
    } catch (error) {
        console.error('MongoDB Connection Error ', error.reason);
    }
};
connectDB();

// Routes
app.get('/ping', (req, res) => {
    return res.json({ msg: 'Ping Successful' });
});

// API Routes
app.use('/api/auth', au);
app.use('/api/users', user);
app.use('/api/messages', msg);

// HTTP Server & Socket.io setup
const server = http.createServer(app); //
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

global.onlineUsers = new Map();
io.on('connection', (socket) => {
    console.log('User connected');

    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { 
    console.log('Server is running on port ', PORT);
});
