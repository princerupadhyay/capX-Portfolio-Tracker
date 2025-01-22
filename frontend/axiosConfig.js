import axios from 'axios';

// Set default configuration for Axios
axios.defaults.withCredentials = true; // This ensures cookies are sent with requests

// You can set other defaults if needed
axios.defaults.baseURL = 'https://capx-portfolio-tracker.onrender.com'; // Replace with your backend URL

export default axios;
