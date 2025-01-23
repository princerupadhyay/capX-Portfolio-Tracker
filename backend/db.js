const mongoose = require('mongoose');

// Initailising MongoDB Connection
const connectToDB = async () => {
    try {
        const dbURI = process.env.MONGO_URI; // Fallback to local URI if MONGO_URI is not set
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to DB");
    }
    catch (err) {
        console.log("Error connecting to DB: ", err);
    }
}

module.exports = connectToDB;