const mongoose = require('mongoose');
const fs = require('fs');
const csvParser = require('csv-parser');
const StockData = require('../models/stockData'); // Import the StockData model
const StockInfo = require('./stockInfo'); // Import your stock info (from StockInfo.js)

// Function to parse CSV and save data to MongoDB
const saveStockDataToDb = async () => {
    // Initialize stockDataMap to store stock data by ticker
    const stockDataMap = {};

    // Loop through each stock in StockInfo.js
    for (let stock of StockInfo) {
        const stockHistory = [];

        // Parse the CSV for historical data
        const csvFilePath = `../utils/csv_files/${stock.ticker}.csv`; // Assuming your CSV files are named after tickers

        // Check if the file exists
        if (fs.existsSync(csvFilePath)) {
            // Use Promise to ensure that CSV parsing is complete before moving on
            await new Promise((resolve, reject) => {
                const data = [];
                fs.createReadStream(csvFilePath)
                    .pipe(csvParser())
                    .on('data', (row) => {
                        // console.log(row); // Check if columns are correct

                        // Format the historical data to match your schema
                        const historicalData = {
                            date: new Date(row['Date']),
                            open: parseFloat(row['Open']),
                            high: parseFloat(row['High']),
                            low: parseFloat(row['Low']),
                            close: parseFloat(row['Close/Last']),
                            volume: parseInt(row['Volume'])
                        };
                        console.log(historicalData);
                        data.push(historicalData);
                    })
                    .on('end', () => {
                        // Once CSV is parsed, save stock data to the database
                        stockDataMap[stock.ticker] = {
                            name: stock.name,
                            ticker: stock.ticker,
                            description: stock.description,
                            img: {
                                original: stock.img.original,
                                light: stock.img.light, // Light mode image URL
                                dark: stock.img.dark    // Dark mode image URL
                            },
                            yearFounded: stock.yearFounded,
                            sector: stock.sector,
                            industry: stock.industry,
                            marketCap: stock.marketCap,
                            website: stock.website,
                            country: stock.country,
                            history: data // Add the parsed historical data
                        };

                        // Resolve the promise to continue processing the next stock
                        resolve();
                    })
                    .on('error', (err) => {
                        console.error(`Error reading CSV for ${stock.ticker}:`, err);
                        reject(err); // Reject promise on error
                    });
            });

            // Save the stock data (with history) to the database after CSV parsing is done
            try {
                const newStockData = new StockData(stockDataMap[stock.ticker]);
                await newStockData.save();
                console.log(`Stock data for ${stock.ticker} saved successfully!`);
            } catch (err) {
                console.error(`Error saving stock data for ${stock.ticker}:`, err);
            }
        } else {
            console.log(`CSV file for ${stock.ticker} not found.`);
        }
    }
};

// Connect to MongoDB and call the function
const dbURI = process.env.MONGO_URI; // Fallback to local URI if MONGO_URI is not set
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        saveStockDataToDb(); // Call the function to save stock data
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });
