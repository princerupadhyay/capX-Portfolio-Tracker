const express = require('express');
const StockData = require('../models/StockData'); // Import your StockData model
const router = express.Router();
const axios = require('axios'); // Import axios for making HTTP requests to Finnhub


const API_KEY = process.env.FINNHUB_API_KEY;

// Route to fetch all stocks
router.get('/', async (req, res) => {
    try {
        const stocks = await StockData.find(); // Find the stock by ticker
        if (stocks) {
            res.json(stocks); // Return the stock data as JSON response
        } else {
            res.status(404).json({ message: 'Stocks not found' }); // If no stock found, send 404
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stocks data' }); // Handle error during fetching
    }
});

// Route to get stock data by ticker
router.get('/:ticker', async (req, res) => {
    try {
        const { ticker } = req.params; // Extract the ticker from the URL parameters
        const stock = await StockData.findOne({ ticker: ticker }); // Find the stock by ticker
        if (stock) {
            res.json(stock); // Return the stock data as JSON response
        } else {
            res.status(404).json({ message: 'Stock not found' }); // If no stock found, send 404
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stock data' }); // Handle error during fetching
    }
});

// Fetch stock price
router.get('/:ticker/price', async (req, res) => {
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
