// models/StockInfo.js
const mongoose = require('mongoose');

// Define the StockInfo schema
const stockInfoSchema = new mongoose.Schema({
    ticker: { type: String, required: true },
    description: { type: String, required: true },
    img: {
        light: { type: String, required: true },
        dark: { type: String, required: true },
    },
    yearFounded: { type: Number, required: true },
    sector: { type: String, required: true },
    industry: { type: String, required: true },
    marketCap: { type: Number, required: true },
    website: { type: String, required: true },
    country: { type: String, required: true },
    history: { type: Array, default: [] },  // Array to store history data
});

// Create the StockInfo model based on the schema
const StockInfo = mongoose.model('StockInfo', stockInfoSchema);

module.exports = StockInfo;
