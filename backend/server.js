require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Validating the backend port with frontend
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport'); // For authentication
const LocalStrategy = require("passport-local").Strategy;
const path = require('path');
const stockInfo = require("./utils/stockInfo.js"); // Your stock data file


// Models
const User = require('./models/user.js');


// Routes
const userRoutes = require('./routes/userRoutes.js');
const portfolioRoutes = require('./routes/portfolioRoutes.js')
const notificationRoutes = require('./routes/notificationRoutes.js')
const stockDataRoutes = require('./routes/stockDataRoutes.js')

// DataBase
const connectToDB = require('./db.js');

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'https://cap-x-portfolio-tracker-frontend.vercel.app', // Replace with the actual origin of your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Express session middleware
app.use(session({
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  secret: 'AbraKaDabra',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize Passport middleware
app.use(passport.initialize()); // Sets up Passport to handle user authentication.
app.use(passport.session()); // Keeps users logged in during their session.

// Set up the local strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate())); // Uses passport-local-mongoose's authenticate method. This uses the authenticate method from the User model to validate user credentials.

// Seralizing and Deserializing Users
passport.serializeUser(User.serializeUser()); // Stores the user ID and other user related information in the session to keep the user logged in.
passport.deserializeUser(User.deserializeUser()); // Retrieves the full user object from the user ID stored in the session when needed.

// Connecting different routes with app
app.use('/auth', userRoutes); // '/auth' is the base path for the authentication routes
app.use('/portfolio', portfolioRoutes); // '/portfolio' is the base path for the portfolio routes
app.use('/notification', notificationRoutes); // '/notification' is the base path for the notification routes
app.use('/stocks', stockDataRoutes); // '/notification' is the base path for the notification routes

// Serve static files from the Vite build directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Endpoint to get all stocks
app.get("/stocksInfo", (req, res) => {
  res.json(stockInfo);
});

// Connecting to MongoDB
connectToDB(); // Call the function to connect to the database

app.use("/", (req, res) => {
  res.status(200).json({ success: "The backend is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'An unexpected error occurred' } = err;
  res.status(statusCode).json({ error: message });
});

// Listening to port
app.listen(port, () => {
  console.log(`listening to port ${port}`);
})