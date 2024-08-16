import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

class AuthController {
    async register(req, res, next) {
        const { username, email, password } = req.body;

        const usernameCheck = await User.findOne({ username});
        if (usernameCheck) {
            return res.status(400).json({ 
                msg: "Username already exists" ,
                status: false,
            });
        }

        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.status(400).json({ 
                msg: "Email already exists",
                status: false,
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        try {
            const savedUser = await newUser.save();
            return res.status(201).json({
                status: true,
                user: savedUser,
            });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }

    async login (req, res, next) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ 
                    msg: "User not found",
                    status: false,
                });
            }
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ 
                    msg: "Invalid Credentials" ,
                    status: false,
                });
            }

            const accessToken = jwt.sign(
                {
                    id: user._id,
                    isAdmin: user.isAdmin,
                }, 
                process.env.JWT_SECRET, 
                { 
                    expiresIn: '3d'   
                }
            );
    
            const { password: userPassword, ...others } = user._doc;
            
            return res.status(200).json({ 
                user: others, 
                token: accessToken,
                status: true,
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async logout(req, res, next) {
        try {
            if (req.params.id) {
                onlineUsers.delete(req.params.id);
                return res.status(200).json({ 
                    msg: "Logout Successful" ,
                    status: true,
                });
            } else {
                return res.status(401).json({ 
                    msg: "User id is required ",
                    status: false,
                });
            }
        } catch (error) {
            return res.status(500).json({ 
                msg: error.message,
                status: false,
            });
        }
    }
}

export default new AuthController();