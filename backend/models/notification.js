const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Notification", notificationSchema);
