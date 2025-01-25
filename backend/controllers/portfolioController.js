const Stock = require('../models/stock.js');
const axios = require('axios'); // Import axios for making HTTP requests to Finnhub
const ExpressError = require('../utils/ExpressError.js');
const User = require('../models/user.js');

const API_KEY = process.env.FINNHUB_API_KEY;

exports.getStocks = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('portfolio');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ stocks: user.portfolio });
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        next(new ExpressError(500, 'Failed to fetch portfolio'));
    }
};

exports.addStock = async (req, res, next) => {
    try {
        const { name, ticker, quantity, purchaseAmount, price } = req.body;

        const stock = new Stock({
            name,
            ticker,
            quantity,
            purchaseAmount,
            price
        });

        await stock.save();

        const user = await User.findById(req.user.id);
        user.portfolio.push(stock._id);
        await user.save();

        res.status(201).json({ message: 'Stock added successfully', stock });
    } catch (error) {
        console.error('Error adding stock:', error);
        next(new ExpressError(500, 'Failed to add stock'));
    }
};

exports.updateStock = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity, purchaseAmount, price } = req.body;

        const stock = await Stock.findByIdAndUpdate(id, { quantity, purchaseAmount, price }, { new: true });

        if (!stock) {
            return next(new ExpressError(404, 'Stock not found'));
        }

        res.status(200).json({ message: 'Stock updated successfully', stock });
    } catch (error) {
        console.error('Error updating stock:', error);
        next(new ExpressError(500, 'Failed to update stock'));
    }
};

exports.deleteStock = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(req.user.id);
        user.portfolio.pull(id);
        await user.save();

        await Stock.findByIdAndDelete(id);

        res.status(200).json({ message: 'Stock deleted successfully' });
    } catch (error) {
        console.error('Error deleting stock:', error);
        next(new ExpressError(500, 'Failed to delete stock'));
    }
};

exports.getValue = async (req, res, next) => {
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
};

exports.getPrice = async (req, res) => {
    const { ticker } = req.params;

    try {
        const response = await axios.get(`https://finnhub.io/api/v1/quote`, {
            params: {
                symbol: ticker,
                token: API_KEY,
            },
        });

        if (response.data && response.data.c) {
            res.json({
                currentPrice: response.data.c,
            });
        } else {
            res.status(404).json({ error: 'Stock price not found' });
        }
    } catch (error) {
        console.error('Error fetching stock price:', error);
        res.status(500).json({ error: 'Error fetching stock price' });
    }
};