import axios from 'axios';

// Set default configuration for Axios
axios.defaults.withCredentials = true; // This ensures cookies are sent with requests

// You can set other defaults if needed
axios.defaults.baseURL = 'http://localhost:3000'; // Replace with your backend URL

export default axios;
