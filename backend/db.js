const mongoose = require('mongoose');

// Initailising MongoDB Connection
const connectToDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MongoDB connection URI is not defined in environment variables.");
        }
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        res.status(200).json({ success: true, message: 'Successfully connected to the database!' });
        console.log("Connected to DB");
    }
    catch (err) {
        console.log("Error connecting to DB: ", err);
        res.status(500).json({ success: false, message: 'Failed to connect to the database', error: err.message });

    }
}

module.exports = connectToDB;