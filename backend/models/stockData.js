const mongoose = require('mongoose');

// Sub-schema for historical data
const historicalDataSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    }, // Date of the historical record
    open: {
        type: Number,
        required: true
    }, // Opening price of the stock
    high: {
        type: Number,
        required: true
    }, // Highest price of the stock
    low: {
        type: Number,
        required: true
    }, // Lowest price of the stock
    close: {
        type: Number,
        required: true
    }, // Closing price of the stock
    volume: {
        type: Number,
        required: true
    } // Trading volume of the stock
});

// Main stock schema
const stockDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ticker: {
        type: String,
        required: true
    }, // Stock ticker symbol
    description: {
        type: String,
        required: false
    }, // Description of the company (optional)
    img: {
        original: {
            type: String,
            required: false
        },
        light: {
            type: String,
            required: false
        }, // Light mode image URL
        dark: {
            type: String,
            required: false
        } // Dark mode image URL
    }, // Images for light and dark modes (optional)
    yearFounded: {
        type: Number,
        required: false
    }, // Year the company was founded (optional)
    sector: {
        type: String,
        required: false
    }, // The sector the company belongs to (optional)
    industry: {
        type: String,
        required: false
    }, // The industry the company operates in (optional)
    marketCap: {
        type: Number,
        required: false
    }, // Market capitalization (optional)
    website: {
        type: String,
        required: false
    }, // Official website URL (optional)
    country: {
        type: String,
        required: false
    }, // Country where the company is based (optional)
    // New field for historical data
    history: [historicalDataSchema]
}, { timestamps: true });

module.exports = mongoose.model('StockData', stockDataSchema);
