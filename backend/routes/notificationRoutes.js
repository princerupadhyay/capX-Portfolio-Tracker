const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Notification = require('../models/notification.js');

// Helper function to add notification to a user
const addNotificationToUser = async (userId, message, type) => {
    try {
        // Create a new notification
        const notification = new Notification({
            message,
            type,
        });

        // Save the notification
        await notification.save();

        // Find the user and add the notification to their notifications array
        const user = await User.findById(userId);
        user.notifications.push(notification._id); // Reference the notification ObjectId
        await user.save();

    } catch (error) {
        console.error('Error adding notification:', error);
    }
};

// Route to save a notification
router.post('/save', async (req, res) => {
    try {
        const { userId, message, type } = req.body;

        // Call the helper function to add notification to the user
        await addNotificationToUser(userId, message, type);

        res.status(200).json({ success: true, message: 'Notification saved!' });
    } catch (error) {
        console.error('Error saving notification:', error);
        res.status(500).json({ success: false, message: 'Failed to save notification.' });
    }
});

// Route to fetch all notifications for a user
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('notifications');
        res.status(200).json({ notifications: user.notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
    }
});

// Route to clear all notifications for a user
router.delete('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user and remove all notification references from their notifications array
        const user = await User.findById(userId);

        // Clear the notifications array
        user.notifications = [];
        await user.save();

        // Optionally, delete the notifications themselves from the Notification collection
        await Notification.deleteMany({ _id: { $in: user.notifications } });

        res.status(200).json({ success: true, message: 'All notifications cleared!' });
    } catch (error) {
        console.error('Error clearing notifications:', error);
        res.status(500).json({ success: false, message: 'Failed to clear notifications.' });
    }
});


module.exports = router;
