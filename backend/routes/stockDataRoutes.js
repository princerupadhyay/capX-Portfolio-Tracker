const express = require('express');
const router = express.Router();
const { getStocks, getStock, getPrice } = require('../controllers/stockDataController');

router.get('/', getStocks);
router.get('/:ticker', getStock);
router.get('/:ticker/price', getPrice);

module.exports = router;
