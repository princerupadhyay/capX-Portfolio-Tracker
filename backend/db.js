const mongoose = require('mongoose');

// Initailising MongoDB Connection
const connectToDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MongoDB connection URI is not defined in environment variables.");
        }
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to DB");
    }
    catch (err) {
        console.log("Error connecting to DB: ", err);

    }
}

module.exports = connectToDB;