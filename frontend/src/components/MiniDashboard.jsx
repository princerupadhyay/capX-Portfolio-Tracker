import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import PortfolioPieChart from "./PortfolioPieChart";
import { fetchStockPrice } from "../api/portfolioService";
import StockList from "./StockList";
import StockForm from "./StockForm";
import { useMediaQuery } from "react-responsive";

const MiniDashboard = ({
  stocks,
  onEdit,
  onDelete,
  editingStock,
  onSubmit,
  portfolioStocks,
}) => {
  const [totalValue, setTotalValue] = useState(0);
  const [topStock, setTopStock] = useState(null);
  const [stockPrices, setStockPrices] = useState({});
  const [showForm, setShowForm] = useState(false);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    const updateStockPrices = async () => {
      const updatedPrices = {};
      for (const stock of stocks) {
        try {
          const priceData = await fetchStockPrice(stock.ticker);
          if (priceData && priceData.currentPrice) {
            updatedPrices[stock.ticker] = parseFloat(priceData.currentPrice);
          }
        } catch (error) {
          console.error(`Error fetching price for ${stock.ticker}:`, error);
        }
      }
      setStockPrices(updatedPrices);
    };

    updateStockPrices();
    const interval = setInterval(updateStockPrices, 30000);
    return () => clearInterval(interval);
  }, [stocks]);

  useEffect(() => {
    let total = 0;
    let topStock = null;
    stocks.forEach((stock) => {
      const stockValue =
        stock.quantity * (stockPrices[stock.ticker] || stock.price);
      total += stockValue;
      if (!topStock || stockValue > topStock.value) {
        topStock = { ...stock, value: stockValue };
      }
    });
    setTotalValue(total);
    setTopStock(topStock);
  }, [stocks, stockPrices]);

  const renderPercentageChange = (stockValue, stock) => {
    const percentageChange = (
      (stockValue / (stock.quantity * stock.price) - 1) *
      100
    ).toFixed(2);
    const isPositive = percentageChange >= 0;
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton
          color={isPositive ? "success" : "error"}
          size="small"
          sx={{ ml: 1, mr: 1 }}
          style={{ transform: "scale(1.5)" }}
        >
          {isPositive ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </IconButton>
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            color: isPositive ? "success.main" : "error.main",
          }}
          style={{ transform: "scale(1.2)" }}
        >
          {percentageChange}%
        </Typography>
      </Box>
    );
  };

  const handleAddStockClick = () => setShowForm(true);
  const handleBackToList = () => setShowForm(false);

  const handleEditClick = (stock) => {
    onEdit(stock);
    setShowForm(true);
  };

  return (
    <Box
      sx={{
        pt: 4,
        color: "#fff",
        borderRadius: 2,
        maxWidth: "lg",
        mx: "auto",
      }}
      style={{
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        paddingBottom: "1rem",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          mb: 4,
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
        }}
      >
        Portfolio Dashboard
      </Typography>

      <Grid container spacing={3} direction={isMobile ? "column" : "row"}>
        {/* Total Value Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: "#333",
              color: "#fff",
              p: 3,
              boxShadow: 4,
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Portfolio Value
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", textShadow: "1px 1px 4px black" }}
              >
                ${totalValue.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Top-Performing Stock */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: "#333",
              color: "#fff",
              p: 3,
              boxShadow: 4,
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top-Performing Stock
              </Typography>
              {topStock ? (
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: "bold",
                        display: "inline",
                      }}
                    >
                      <div style={{ display: "flex" }}>
                        {topStock.name}{" "}
                        {renderPercentageChange(topStock.value, topStock)}
                      </div>
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                ""
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Portfolio Distribution Chart */}
        <Grid item xs={6}>
          <Paper
            sx={{
              backgroundColor: "#333",
              color: "#fff",
              p: 4,
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Portfolio Distribution
            </Typography>
            <PortfolioPieChart stocks={stocks} />
          </Paper>
        </Grid>

        {/* Stock Holdings with Flip Effect */}
        <Grid item xs={6}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              perspective: 1000,
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                transformStyle: "preserve-3d",
                transition: "transform 0.8s",
                transform: showForm ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front Side - Stock List */}
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  backfaceVisibility: "hidden",
                }}
              >
                <Paper
                  sx={{
                    backgroundColor: "#333",
                    color: "#fff",
                    p: 4,
                    boxShadow: 3,
                    borderRadius: 2,
                  }}
                  style={{ maxHeight: "28.5rem" }}
                >
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Top Holdings
                  </Typography>
                  <div
                    style={{
                      minHeight: "25.5rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <StockList
                        stocks={stocks}
                        onEdit={handleEditClick}
                        onDelete={onDelete}
                      />
                    </div>

                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: "1.25rem",
                        borderColor: "white",
                        textTransform: "none",
                        p1: 1,
                        pr: 2.5,
                        color: "white",
                        width: 90,
                        "&:hover": {
                          backgroundColor: "lightgrey",
                          borderColor: "black",
                          color: "black",
                        },
                      }}
                      onClick={handleAddStockClick}
                    >
                      <AddIcon /> Add
                    </Button>
                  </div>
                </Paper>
              </Box>

              {/* Back Side - Stock Form */}
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <Paper
                  sx={{
                    backgroundColor: "#333",
                    color: "#fff",
                    boxShadow: 3,
                    p: 4,
                    borderRadius: 2,
                  }}
                  style={{ minHeight: "28.5rem" }}
                >
                  <div
                    style={{
                      minHeight: "28.5rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <StockForm
                      onSubmit={onSubmit}
                      editingStock={editingStock}
                      portfolioStocks={portfolioStocks}
                      backToList={handleBackToList}
                    />
                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: "1.25rem",
                        borderColor: "white",
                        textTransform: "none",
                        p1: 1,
                        pr: 2.5,
                        ml: 1,
                        width: 90,
                        color: "white",
                        "&:hover": {
                          backgroundColor: "lightgrey",
                          borderColor: "black",
                          color: "black",
                        },
                      }}
                      onClick={handleBackToList}
                    >
                      <ArrowBackIcon /> Back
                    </Button>
                  </div>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MiniDashboard;
