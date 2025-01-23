const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    password: {
        type: String,
        required: true
    }
},
    { timestamps: true }); // Automatically adds `createdAt` and `updatedAt`

// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
    const payload = { id: this._id, email: this.email };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = mongoose.model('User', userSchema);
