require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const stockInfo = require("./utils/stockInfo.js");

// Routes
const userRoutes = require('./routes/userRoutes.js');
const portfolioRoutes = require('./routes/portfolioRoutes.js');
const notificationRoutes = require('./routes/notificationRoutes.js');
const stockDataRoutes = require('./routes/stockDataRoutes.js');

// DataBase
const connectToDB = require('./db.js');

const app = express();
const port = 3000;

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: 'https://cap-x-portfolio-tracker-frontend.vercel.app',
  credentials: true,
  secure: process.env.NODE_ENV === 'production'
}));

// Connecting different routes with app
app.use('/auth', userRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/notification', notificationRoutes);
app.use('/stocks', stockDataRoutes);

// Serve static files from the Vite build directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Endpoint to get all stocks
app.get("/stocksInfo", (req, res) => {
  res.json(stockInfo);
});

// Connecting to MongoDB
connectToDB();

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'An unexpected error occurred' } = err;
  res.status(statusCode).json({ error: message });
});

// Listening to port
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});