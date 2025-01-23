const mongoose = require('mongoose');
const StockData = require('../models/stockData'); // Import StockData model
const StockInfo = require('./stockInfo'); // Import the stock info (from StockInfo.js)

// Function to fetch historical stock data and update the StockInfo array
const updateStockInfoWithHistory = async () => {
    // Loop through each stock in StockInfo.js
    for (let stock of StockInfo) {
        try {
            // Fetch historical data from the StockData model based on ticker
            const stockHistory = await StockData.findOne({ ticker: stock.ticker }).select('history');

            if (stockHistory) {
                // Add historical data to the stock object
                stock.history = stockHistory.history;

                console.log(`History for ${stock.ticker} added successfully.`);
            } else {
                console.log(`No historical data found for ${stock.ticker}`);
            }
        } catch (err) {
            console.error(`Error fetching historical data for ${stock.ticker}:`, err);
        }
    }

    // At this point, StockInfo array will have the history data added to each stock
    console.log("Stock Info updated with historical data:", StockInfo);
};

// Connect to MongoDB and call the function to update StockInfo
mongoose.connect('mongodb://localhost:27017/portfolio', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        updateStockInfoWithHistory(); // Update StockInfo with history data
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });
