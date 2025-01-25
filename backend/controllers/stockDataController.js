const StockData = require('../models/stockData');
const axios = require('axios');

const API_KEY = process.env.FINNHUB_API_KEY;

exports.getStocks = async (req, res) => {
    try {
        const stocks = await StockData.find();
        if (stocks) {
            res.json(stocks);
        } else {
            res.status(404).json({ message: 'Stocks not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stocks data' });
    }
};

exports.getStock = async (req, res) => {
    try {
        const { ticker } = req.params;
        const stock = await StockData.findOne({ ticker: ticker });
        if (stock) {
            res.json(stock);
        } else {
            res.status(404).json({ message: 'Stock not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stock data' });
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