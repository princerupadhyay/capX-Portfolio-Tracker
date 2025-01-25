const express = require('express');
const { ensureAuthenticated } = require('../middlewares/authMiddleware.js')
const { getStocks,  addStock, updateStock, getPrice, getValue, deleteStock } = require('../controllers/portfolioController');

const router = express.Router();

router.get('/', getStocks);
router.post('/', addStock);
router.put('/:id', ensureAuthenticated, updateStock);
router.delete('/:id', ensureAuthenticated, deleteStock);
router.get('/value', ensureAuthenticated, getValue);
router.get('/stocks/:ticker/price', getPrice);

module.exports = router;
