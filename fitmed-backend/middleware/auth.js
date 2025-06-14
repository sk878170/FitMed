import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization"); // Get token from Authorization header

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        const token = authHeader.split(" ")[1]; // Extract actual token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        
        if (!decoded.userId) {
            return res.status(401).json({ msg: "Invalid token payload" });
        }

        req.user = decoded.userId; // Attach user ID to request
        next(); // Proceed to next middleware/route
    } catch (err) {
        res.status(401).json({ msg: "Invalid token" });
    }
};

export default authMiddleware;
