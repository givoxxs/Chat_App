import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const autherHeader = req.headers.authorization;
    if (autherHeader) {
        const token = autherHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({
                    msg: "Token is not valid",
                    status: false,
                });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({
            msg: "You are not authenticated",
            status: false,
        });
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({
                msg: "You are not allowed to do that",
                status: false,
            });
        }
    });
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({
                msg: "You are not allowed to do that",
                status: false,
            });
        }
    });
};

export { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };