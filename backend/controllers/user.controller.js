import User from "../models/User.js";

class UserController {
    async getAllUsers(req, res, next) {
        try {
            const users = await User.find({ _id: { $ne: req.params.id } }).select([
                "email",
                "username",
                "avatarImage",
                "_id",
              ]);
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ 
                msg: error.message,
                status: false,
            });
        }
    }

    async getUserById(req, res, next) {
        try {
            const user = await User.findById(req.params.id);
            const { password, ...other } = user._doc;
            return res.status(200).json(other);
        } catch (error) {
            return res.status(500).json({ 
                msg: error.message,
                status: false,
            });
        }
    }  
    
    async setAvatar(req, res, next) {
        try {
            const userId = req.params.id;
            const avatarImage = req.body.image;
            const userData = await User.findByIdAndUpdate(
                userId,
                { 
                    isAvatarImageSet: true,
                    avatarImage
                },
                { new: true }
            );
            return res.status(200).json
            ({
                isSet: userData.isAvatarImageSet,
                image: userData.avatarImage,
            });
        } catch (error) {
            return res.status(500).json({ 
                msg: error.message,
                status: false,
            });
        }
    }
};

export default new UserController();