const express = require('express');
const Stock = require('../models/stock.js');
const axios = require('axios'); // Import axios for making HTTP requests to Finnhub
const ExpressError = require('../utils/ExpressError.js');
const { ensureAuthenticated } = require('../middlewares/authMiddleware.js')
const User = require('../models/user.js');

const router = express.Router();

const API_KEY = process.env.FINNHUB_API_KEY;

// Fetch all stocks in the portfolio
router.get('/', ensureAuthenticated, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('portfolio'); // Populate the portfolio with full stock details
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ stocks: user.portfolio }); // Send populated stocks
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        next(new ExpressError(500, 'Failed to fetch portfolio'));
    }
});

// Add a new stock to the portfolio
router.post('/', ensureAuthenticated, async (req, res, next) => {
    try {
        const { name, ticker, quantity, purchaseAmount, price } = req.body;

        // Create the new stock document
        const stock = new Stock({
            name,
            ticker,
            quantity,
            purchaseAmount,
            price
        });

        // Save the stock to the database
        await stock.save();

        // Add the stock's ObjectId to the user's portfolio
        const user = await User.findById(req.user.id); // Get the current user
        user.portfolio.push(stock._id); // Add stock's ObjectId to user's portfolio
        await user.save(); // Save the user with the updated portfolio

        res.status(201).json({ message: 'Stock added successfully', stock });
    } catch (error) {
        console.error('Error adding stock:', error);
        next(new ExpressError(500, 'Failed to add stock'));
    }
});

// Update stock details in the portfolio
router.put('/:id', ensureAuthenticated, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity, purchaseAmount, price } = req.body;

        // Find and update the stock
        const stock = await Stock.findByIdAndUpdate(id, { quantity, purchaseAmount, price }, { new: true });

        if (!stock) {
            return next(new ExpressError(404, 'Stock not found'));
        }

        res.status(200).json({ message: 'Stock updated successfully', stock });
    } catch (error) {
        console.error('Error updating stock:', error);
        next(new ExpressError(500, 'Failed to update stock'));
    }
});


// Delete a stock from the portfolio
router.delete('/:id', ensureAuthenticated, async (req, res, next) => {
    try {
        const { id } = req.params;

        // Remove stock from the portfolio
        const user = await User.findById(req.user.id);
        user.portfolio.pull(id); // Remove the stock's ObjectId from the portfolio array
        await user.save();

        // Delete the stock from the stock collection
        await Stock.findByIdAndDelete(id);

        res.status(200).json({ message: 'Stock deleted successfully' });
    } catch (error) {
        console.error('Error deleting stock:', error);
        next(new ExpressError(500, 'Failed to delete stock'));
    }
});


// Calculate the total portfolio value
router.get('/value', ensureAuthenticated, async (req, res, next) => {
    try {
        const stocks = await Stock.find({ userId: req.user.id });

        if (!stocks || stocks.length === 0) {
            return res.status(404).json({ message: 'No stocks found in your portfolio' });
        }

        const totalValue = stocks.reduce((sum, stock) => {
            return sum + stock.quantity * stock.currentPrice;
        }, 0);

        res.status(200).json({ totalValue });
    } catch (error) {
        console.error('Error calculating portfolio value:', error);
        next(new ExpressError(500, 'Failed to calculate portfolio value'));
    }
});

// Route to fetch stock price
router.get('/stocks/:ticker/price', async (req, res) => {
    const { ticker } = req.params;

    try {
        // Make a request to Finnhub API for the stock price
        const response = await axios.get(`https://finnhub.io/api/v1/quote`, {
            params: {
                symbol: ticker,
                token: API_KEY,
            },
        });

        // Check if the response data is valid
        if (response.data && response.data.c) {
            // Respond with the current price
            res.json({
                currentPrice: response.data.c, // Current price
            });
        } else {
            res.status(404).json({ error: 'Stock price not found' });
        }
    } catch (error) {
        console.error('Error fetching stock price:', error);
        res.status(500).json({ error: 'Error fetching stock price' });
    }
});

module.exports = router;
