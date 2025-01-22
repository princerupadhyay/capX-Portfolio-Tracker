function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { // Assuming you're using Passport.js
        return next();
    }
    res.status(401).json({ message: "Unauthorized User" });
    // res.redirect('auth/login'); // Or handle unauthorized access appropriately
}

module.exports = { ensureAuthenticated };
