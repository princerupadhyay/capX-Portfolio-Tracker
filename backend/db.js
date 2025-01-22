const mongoose = require('mongoose');

// Initailising MongoDB Connection
const connectToDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/portfolio");
        console.log("Connected to DB");
    }
    catch (err) {
        console.log("Error connecting to DB: ", err);
    }
}

module.exports = connectToDB;