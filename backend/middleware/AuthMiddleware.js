import jwt from "jsonwebtoken"; //prove user is logged in

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
}

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Get the token from the Authorization header
    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user information to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired." });
        }
        res.status(401).json({ success: false, message: "Invalid token." });
    }
};

export default authMiddleware;