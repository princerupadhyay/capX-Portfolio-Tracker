## **CapX Portfolio Tracker Application 🚀**

A feature-rich, responsive Portfolio Tracker application built with React for the frontend and Node.js with MongoDB for the backend. The app allows users to track and manage their stock holdings dynamically with real-time data integration.

---

**Features ✨**

- **User Authentication:** Secure login with user-specific portfolio management.
- **Add, Edit, and Delete Stocks:** Manage your portfolio with ease.
- **Customizable Stock Quantities:** Adjust stock quantities based on user preferences.
- **Real-Time Notifications:** Get notified about stock updates and portfolio changes instantly.
- **Real-Time Portfolio Value:** Fetch live stock prices dynamically to calculate your portfolio's total value.
- **Dashboard with Insights:** View top-performing stocks, portfolio distribution, and more.
- **Historical Data Charts:** View stock trends and performance over time with integrated charts
- **10 Pre-Supported Stocks:** Users can begin managing their portfolio with pre-defined stocks
- **Responsive Design:** Optimized for both desktop and mobile devices.

---

**Tech Stack 🛠️**

- **Frontend:** React.js, Material-UI, Chart.js for historical data visualization
- **Backend:** Node.js with Express.js, Axios for real-time API integration
- **Database:** MongoDB (Atlas)
- **Stock Price API:** [Finnhub](https://finnhub.io)
- **Deployment:**
  - Frontend: Vercel
  - Backend: Render

---

**Project Preview** 🎥

- Screenshots (Desktop)
  ![Screenshot 1](<https://github.com/princerupadhyay/capX-Portfolio-Tracker/blob/main/raw/images/Screenshot%20(130).png>)
  ![Screenshot 2](<https://github.com/princerupadhyay/capX-Portfolio-Tracker/blob/main/raw/images/Screenshot%20(131).png>)
  ![Screenshot 3](<https://github.com/princerupadhyay/capX-Portfolio-Tracker/blob/main/raw/images/Screenshot%20(132).png>)
  ![Screenshot 4](<https://github.com/princerupadhyay/capX-Portfolio-Tracker/blob/main/raw/images/Screenshot%20(133).png>)
  ![Screenshot 5](<https://github.com/princerupadhyay/capX-Portfolio-Tracker/blob/main/raw/images/Screenshot%20(134).png>)
  ![Screenshot 6](<https://github.com/princerupadhyay/capX-Portfolio-Tracker/blob/main/raw/images/Screenshot%20(135).png>)
  ![Screenshot 7](<https://github.com/princerupadhyay/capX-Portfolio-Tracker/blob/main/raw/images/Screenshot%20(136).png>)

- Screenshots (Mobile)
  ![Screenshot 1](https://github.com/princerupadhyay/capX-Portfolio-Tracker/blob/main/raw/images/Screenshot%202025-01-25%20182640.png)
  ![Screenshot 1](https://github.com/princerupadhyay/capX-Portfolio-Tracker/blob/main/raw/images/Screenshot%202025-01-25%20182723.png)
  ![Screenshot 1](https://github.com/princerupadhyay/capX-Portfolio-Tracker/blob/main/raw/images/Screenshot%202025-01-25%20182805.png)
  ![Screenshot 1](https://github.com/princerupadhyay/capX-Portfolio-Tracker/blob/main/raw/images/Screenshot%202025-01-25%20182827.png)
  ![Screenshot 1](https://github.com/princerupadhyay/capX-Portfolio-Tracker/blob/main/raw/images/Screenshot%202025-01-25%20182846.png)

---

**Getting Started 🖥️**

Follow these steps to set up and run the project locally on your machine:

**Prerequisites**

1. Install **Node.js** and **npm**.
2. Set up a **MongoDB** server (local or cloud-based, e.g., MongoDB Atlas).
3. Obtain an API key from your chosen stock price API provider (e.g.Finnhub).

---

**Installation and Setup**

**Clone the Repository**

- `git clone <repository-url>`

**Backend Setup**

Navigate to the backend folder:

- `cd backend`

Install dependencies:

- `npm install`

Configure environment variables in a .env file:

- `PORT=5000`

- `MONGO\_URI=your-mongodb-uri`

- `STOCK\_API\_KEY=your-stock-api-key`

Start the backend server:

- `npm start`

The backend will run on http://localhost:5000.

**Frontend Setup**

Navigate to the frontend folder:

- `cd frontend`

Install dependencies:

- `npm install`

Configure the backend API URL in the environment variables:

- `REACT\_APP\_API\_URL=http://localhost:5000`

Start the frontend development server:

- `npm start`

The frontend will run on http://localhost:3000.

---

**Usage Instructions 📝**

1. Open the application in your browser (e.g., http://localhost:3000 if running locally).
1. Use the form to add new stocks by entering details like stock name, ticker, and buy price.
1. Edit or delete stocks as needed from the stock list.
1. Monitor your portfolio's value, distribution, and top-performing stocks on the dashboard.

---

**Assumptions and Limitations ⚠️**

- **Stock Quantity Fixed:** Each stock's quantity is fixed at 1 for this assignment.
- **API Rate Limits:** Real-time stock prices depend on the free tier of the stock price API service, which may impose rate limits.
- **Hardcoded Portfolio Stocks:** For simplicity, only 5 stocks are pre-assigned to each user.

---

**Deployment Links 🌐**

- **Live Application:** [CapX Portfolio Tracker](https://cap-x-portfolio-tracker-frontend.vercel.app/)
- **GitHub Repository:** [Repository Link](https://github.com/princerupadhyay/capX-Portfolio-Tracker)

---

**Database Schema 🗄️**

| **Field**      | **Type** | **Description**                                               |
| :------------- | :------- | :------------------------------------------------------------ |
| name           | String   | Name of the stock (e.g., Apple)                               |
| ticker         | String   | Stock symbol (e.g., AAPL)                                     |
| buyPrice       | Number   | Price at which the stock was bought                           |
| quantity       | Number   | Number of shares (default: 1)                                 |
| purchaseAmount | Number   | Price of stocks purchased (default: API price for 1 quantity) |
| \_id           | String   | Associated user ID                                            |

---

**Future Enhancements 🚀**

- Enable **advanced analytics**, such as risk assessment and returns calculation.
- Support exporting portfolio reports in formats like **CSV or PDF**.
- Integrate **social sharing** to allow users to share their portfolio performance.

---

**Contributors 🤝**

- **Prince Upadhyay** – Full Stack Developer
- Special thanks to the open-source libraries and APIs used in this project.
