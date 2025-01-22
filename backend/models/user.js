const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    fullName: { type: String }, // New field to track first login
    portfolio: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stock' // References stocks owned by the user
        }
    ],
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notification' // References stocks owned by the user
        },
    ],
},
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
)

// Use passportLocalMongoose with configuration
userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email', // Use 'email' field for login
});

module.exports = mongoose.model('User', userSchema);

