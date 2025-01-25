const User = require('../models/user.js');
const Notification = require('../models/notification.js');

const addNotificationToUser = async (userId, message, type) => {
    try {
        const notification = new Notification({
            message,
            type,
        });

        await notification.save();

        const user = await User.findById(userId);
        user.notifications.push(notification._id);
        await user.save();

    } catch (error) {
        console.error('Error adding notification:', error);
    }
};

exports.saveNotification = async (req, res) => {
    try {
        const { message, type } = req.body;
        const userId = req.user.id;

        await addNotificationToUser(userId, message, type);

        res.status(200).json({ success: true, message: 'Notification saved!' });
    } catch (error) {
        console.error('Error saving notification:', error);
        res.status(500).json({ success: false, message: 'Failed to save notification.' });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate('notifications');
        res.status(200).json({ notifications: user.notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
    }
};

exports.deleteNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        user.notifications = [];
        await user.save();

        await Notification.deleteMany({ _id: { $in: user.notifications } });

        res.status(200).json({ success: true, message: 'All notifications cleared!' });
    } catch (error) {
        console.error('Error clearing notifications:', error);
        res.status(500).json({ success: false, message: 'Failed to clear notifications.' });
    }
};