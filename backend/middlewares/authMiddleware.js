const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from header

    if (!token) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = decoded; // Attach user info to the request object
        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { ensureAuthenticated };
