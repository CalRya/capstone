const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure you have a User model

const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from request header

    if (!token) {
        return res.status(401).json({ message: "Unauthorized. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = await User.findById(decoded.id).select("-password"); // Attach user to request
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }
        next();
    } catch (error) {
        console.error("❌ Authentication error:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authenticateUser;
