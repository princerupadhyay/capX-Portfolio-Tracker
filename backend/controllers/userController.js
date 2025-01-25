const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const ExpressError = require('../utils/ExpressError.js');
const Stock = require("../models/stock.js");
const Notification = require('../models/notification.js');

const axios = require('axios');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const API_KEY = process.env.FINNHUB_API_KEY;

exports.registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return next(new ExpressError(400, 'Email already exists'));
        }

        const newUser = new User({ username, email, password });

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

        const randomStocks = availableStocks
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

        for (const stockData of randomStocks) {
            const stockPrice = await axios.get(`https://finnhub.io/api/v1/quote`, {
                params: { symbol: stockData.ticker, token: API_KEY },
            });

            const currentPrice = stockPrice.data.c || 100;

            const stock = new Stock({
                name: stockData.name,
                ticker: stockData.ticker,
                quantity: 1,
                purchaseAmount: currentPrice,
                price: currentPrice,
            });

            await stock.save();
            newUser.portfolio.push(stock._id);

            const notification = new Notification({
                message: `${stockData.ticker} stock has been added to your portfolio.`,
                type: 'added',
            });

            await notification.save();

            newUser.notifications.push(notification._id);
        }

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, username: newUser.username, email: newUser.email, fullName: newUser.fullName }, JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(201).json({ message: 'User registered successfully', token, portfolio: newUser.portfolio });
    } catch (error) {
        console.error('Error registering user:', error);
        next(new ExpressError(500, 'Server error'));
    }
};

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const authToken = jwt.sign(
            { id: user._id, username: user.username, email: user.email, fullName: user.fullName, },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Welcome to capX, You are logged in!',
            authToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName || ''
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        next(new ExpressError(500, 'Server error'));
    }
};

exports.logoutUser = async (req, res, next) => {
    try {
        res.status(200).json({
            message: 'Logout successful.',
        });
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authentication token is missing' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        const { email, username, fullName } = req.body;

        if (!email || !username || !fullName) {
            return res.status(400).json({ message: 'Email, Username, and Full Name are required' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail && existingEmail._id.toString() !== userId) {
            return res.status(400).json({ message: 'Email is already taken by another user' });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername && existingUsername._id.toString() !== userId) {
            return res.status(400).json({ message: 'Username is already taken by another user' });
        }

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
};

exports.newUserName = async (req, res) => {
    const { username } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return res.json({ isUnique: false });
    }

    return res.json({ isUnique: true });
};

exports.checkAuth = (req, res) => {
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
};

exports.getUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token is missing' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const { id } = decoded;

        const user = await User.findById(id).select("username email fullName");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

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
};

exports.updateName = async (req, res, next) => {
    try {
        const { fullName } = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.fullName = fullName;
        await user.save();

        res.status(200).json({ message: 'Name updated successfully' });
    } catch (error) {
        console.error('Error updating name:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};