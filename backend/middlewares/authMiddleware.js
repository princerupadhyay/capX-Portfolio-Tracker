const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

function ensureAuthenticated(req, res, next) {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "Unauthorized User: Token is missing" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach the decoded user info to the request object (if needed)

        return next(); // Proceed to the next middleware or route handler
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Unauthorized User: Invalid or expired token" });
        }
        console.error('Error in authentication middleware:', error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { ensureAuthenticated };
