const express = require('express');
const passport = require('passport');
const path = require('path');
const User = require('../models/user.js');
const ExpressError = require('../utils/ExpressError.js');
const Stock = require("../models/stock.js");
const Notification = require('../models/notification.js'); // Import Notification model
const jwt = require('jsonwebtoken');
const { ensureAuthenticated } = require('../middlewares/authMiddleware.js');


const axios = require('axios');

const router = express.Router(); // We use the router to define our routes separately and then export them.

const JWT_SECRET = process.env.JWT_SECRET;  // You can use environment variables for this in production

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

        // Create new user
        const newUser = new User({ username, email });
        await User.register(newUser, password); // Register with the provided password

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

        res.status(201).json({ message: 'User registered successfully', portfolio: newUser.portfolio });
    } catch (error) {
        console.error('Error registering user:', error);
        next(new ExpressError(500, 'Server error')); // Pass error to the error handling middleware
    }
});

// Login route (POST)
router.post("/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }

            // Generate the auth token (JWT)
            const authToken = jwt.sign(
                { id: user._id, username: user.username },  // Payload data
                JWT_SECRET, // Secret key to sign the JWT
                { expiresIn: '1h' }  // Token expiry time (optional)
            );


            return res.status(200).json({
                message: 'Welcome to Revisor, You are logged in!',
                authToken,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName
                }
            });
        });
    })(req, res, next);
});


router.get('/logout', async (req, res, next) => {
    try {
        req.logout((err) => {
            if (err) return next(err); // Pass error to error-handling middleware
            // Respond with success message
            res.status(200).json({ message: 'Logout successful' });
        });
    } catch (error) {
        next(error); // Pass unexpected errors to error-handling middleware
    }
});


// Update the user's profile information
router.put("/update", ensureAuthenticated, async (req, res, next) => {
    try {
        const { email, username, fullName } = req.body;

        // Ensure the email, username, and full name are provided
        if (!email || !username || !fullName) {
            return res.status(400).json({ message: 'Email, Username, and Full Name are required' });
        }

        // Check if the email is already taken by another user
        const existingEmail = await User.findOne({ email });
        if (existingEmail && existingEmail._id.toString() !== req.user._id.toString()) {
            return res.status(400).json({ message: 'Email is already taken by another user' });
        }

        // Check if the username is already taken by another user
        const existingUsername = await User.findOne({ username });
        if (existingUsername && existingUsername._id.toString() !== req.user._id.toString()) {
            return res.status(400).json({ message: 'Username is already taken by another user' });
        }

        // Update the user's profile information
        const user = await User.findById(req.user._id);
        user.email = email;
        user.username = username;
        user.fullName = fullName;

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully', user: user });
    } catch (error) {
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
    if (req.isAuthenticated()) {
        return res.status(200).json({ isAuthenticated: true });
    } else {
        return res.status(401).json({ isAuthenticated: false });
    }
});

// Get User Info
router.get("/user", ensureAuthenticated, (req, res) => {
    console.log('Req:', req);
    console.log('Session:', req.session); // Check if session exists
    console.log('User:', req.user);
    if (req.isAuthenticated()) {
        res.status(200).json({ user: req.user });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
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
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { fullName } = req.body;

        // Ensure the fullName is provided
        if (!fullName || fullName.trim().length === 0) {
            return res.status(400).json({ message: 'Full name is required' });
        }

        // Update the fullName for the authenticated user
        const user = await User.findById(req.user._id);
        user.fullName = fullName;
        await user.save();

        res.status(200).json({ message: 'Full name updated successfully' });
    } catch (error) {
        console.error('Error updating full name:', error);
        next(new ExpressError(500, 'Server error'));
    }
});


module.exports = router;