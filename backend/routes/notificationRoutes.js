const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/authMiddleware.js');
const { saveNotification, getNotifications, deleteNotifications } = require('../controllers/notificationController');

router.post('/save', ensureAuthenticated, saveNotification);
router.get('/', ensureAuthenticated, getNotifications);
router.delete('/', ensureAuthenticated, deleteNotifications);

module.exports = router;
