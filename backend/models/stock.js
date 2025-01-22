const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        }, // Stock name

        ticker: {
            type: String,
            required: true
        }, // Stock ticker symbol

        quantity: {
            type: Number,
            required: true,
            min: [0.01, 'Quantity must be a positive number'] // Enforce positive value
        }, // Quantity of stocks purchased

        purchaseAmount: {
            type: Number,
            required: true,
            min: [0.01, 'Purchase amount must be a positive number'] // Enforce positive value
        }, // Amount of stock was purchased

        price: {
            type: Number,
            required: true,
            min: [0.01, 'Price must be a positive number'] // Enforce positive value
        }, // Current price of the stock
    },
    { timestamps: true }
);

module.exports = mongoose.model('Stock', stockSchema);
