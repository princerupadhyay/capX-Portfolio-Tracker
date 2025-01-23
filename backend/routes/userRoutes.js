const express = require('express');
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating and verifying JWTs
const User = require('../models/user.js');
const ExpressError = require('../utils/ExpressError.js');
const Stock = require("../models/stock.js");
const Notification = require('../models/notification.js'); // Import Notification model
const { ensureAuthenticated } = require('../middlewares/authMiddleware.js');

const axios = require('axios');

const router = express.Router(); // We use the router to define our routes separately and then export them.

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';  // You can use environment variables for this in production

const API_KEY = process.env.FINNHUB_API_KEY;

// Registration route (POST)
router.post("/register", async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return next(new ExpressError(400, 'Email already exists'));
        }

        // Create a new user
        const newUser = new User({ username, email, password });

        // List of available stocks
        const availableStocks = [
            { name: "Apple", ticker: "AAPL" },
            { name: "Microsoft", ticker: "MSFT" },
            { name: "Google", ticker: "GOOGL" },
            { name: "Tesla", ticker: "TSLA" },
            { name: "Amazon", ticker: "AMZN" },
            { name: "Meta", ticker: "META" },
            { name: "Netflix", ticker: "NFLX" },
            { name: "NVIDIA", ticker: "NVDA" },
            { name: "Intel", ticker: "INTC" },
            { name: "AMD", ticker: "AMD" },
        ];

        // Shuffle the array and pick the first 5 stocks
        const randomStocks = availableStocks
            .sort(() => 0.5 - Math.random()) // Randomize order
            .slice(0, 5); // Select first 5 items

        for (const stockData of randomStocks) {
            const stockPrice = await axios.get(`https://finnhub.io/api/v1/quote`, {
                params: { symbol: stockData.ticker, token: API_KEY },
            });

            const currentPrice = stockPrice.data.c || 100; // Default to 100 if API fails

            // Create a stock document
            const stock = new Stock({
                name: stockData.name,
                ticker: stockData.ticker,
                quantity: 1,
                purchaseAmount: currentPrice,
                price: currentPrice,
            });

            await stock.save(); // Save the stock to the database
            newUser.portfolio.push(stock._id); // Add stock ID to user's portfolio

            // Create a notification for the added stock
            const notification = new Notification({
                message: `${stockData.ticker} stock has been added to your portfolio.`,
                type: 'added', // Type of the notification (can be "stockAdded", "priceUpdated", etc.)
            });

            await notification.save(); // Save notification to the database

            // Add the notification to the user's notifications
            newUser.notifications.push(notification._id);
        }

        await newUser.save(); // Save the updated user

        // Generate JWT
        const token = jwt.sign({ id: newUser._id, username: newUser.username, email: newUser.email, fullName: newUser.fullName }, JWT_SECRET, {
            expiresIn: '1d', // Token valid for 1 day
        });

        res.status(201).json({ message: 'User registered successfully', token, portfolio: newUser.portfolio });
    } catch (error) {
        console.error('Error registering user:', error);
        next(new ExpressError(500, 'Server error')); // Pass error to the error handling middleware
    }
});

// Login route (POST)
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT
        const authToken = jwt.sign(
            { id: user._id, username: user.username, email: user.email, fullName: user.fullName, }, // Payload data
            JWT_SECRET, // Secret key to sign the JWT
            { expiresIn: '1h' } // Token expiry time
        );

        // Respond with token and user info
        res.status(200).json({
            message: 'Welcome to Revisor, You are logged in!',
            authToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName || '' // Default to empty string if fullName is not set
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        next(new ExpressError(500, 'Server error'));
    }
});


router.get('/logout', async (req, res, next) => {
    try {
        // Instruct the client to clear the token
        res.status(200).json({
            message: 'Logout successful.',
        });
    } catch (error) {
        next(error); // Pass unexpected errors to error-handling middleware
    }
});


// Update the user's profile information
router.put("/update", ensureAuthenticated, async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
        if (!token) {
            return res.status(401).json({ message: 'Authentication token is missing' });
        }

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        const { email, username, fullName } = req.body;

        // Ensure the email, username, and full name are provided
        if (!email || !username || !fullName) {
            return res.status(400).json({ message: 'Email, Username, and Full Name are required' });
        }

        // Check if the email is already taken by another user
        const existingEmail = await User.findOne({ email });
        if (existingEmail && existingEmail._id.toString() !== userId) {
            return res.status(400).json({ message: 'Email is already taken by another user' });
        }

        // Check if the username is already taken by another user
        const existingUsername = await User.findOne({ username });
        if (existingUsername && existingUsername._id.toString() !== userId) {
            return res.status(400).json({ message: 'Username is already taken by another user' });
        }

        // Update the user's profile information
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.email = email;
        user.username = username;
        user.fullName = fullName;

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                fullName: user.fullName,
            },
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        console.error('Error updating profile:', error);
        next(new ExpressError(500, 'Server error'));
    }
});

// Check Uniqueness of new Username
router.post("/:newUsername", async (req, res) => {
    const { username } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return res.json({ isUnique: false });
    }

    return res.json({ isUnique: true });
});


// Check Authentication status route
router.get("/checkAuth", (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
        if (!token) {
            return res.status(401).json({ isAuthenticated: false, message: 'Token is missing' });
        }

        // Verify the token
        jwt.verify(token, JWT_SECRET);
        return res.status(200).json({ isAuthenticated: true });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ isAuthenticated: false, message: 'Invalid or expired token' });
        }
        console.error('Error checking authentication:', error);
        res.status(500).json({ isAuthenticated: false, message: 'Server error' });
    }
});

// Get User Info
router.get("/user", async (req, res) => {
    try {
        // Extract token from Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token is missing' });
        }

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Retrieve user ID from token payload
        const { id } = decoded;

        // Fetch the full user data from the database using the user ID
        const user = await User.findById(id).select("username email fullName");  // Select relevant fields

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send back the full user info
        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
            }
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Backend route
router.get("/:userProfile", async (req, res) => {
    try {
        const { userProfile } = req.params;

        // Check if user exists in the database
        const user = await User.findOne({ username: userProfile });

        if (user) {
            // User exists
            res.json({ exists: true });
        } else {
            // User does not exist
            res.status(404).json({ exists: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ exists: false });
    }
});

// Update the user's full name
router.put("/update-name", ensureAuthenticated, async (req, res, next) => {
    try {
        const { fullName } = req.body;
        const userId = req.user.id; // Retrieve the userId from the decoded JWT token
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's full name
        user.fullName = fullName;
        await user.save();

        res.status(200).json({ message: 'Name updated successfully' });
    } catch (error) {
        console.error('Error updating name:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;