import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: "Invalid or expired token" });
        
            req.user = user; // Ensure req.user.id is set
            next();
          });
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

export default authenticateUser;
