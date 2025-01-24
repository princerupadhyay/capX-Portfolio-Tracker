import MiniDashboard from "./MiniDashboard";
import StockList from "./StockList";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  addStock,
  updateStock,
  deleteStock,
  getPortfolio,
} from "../api/portfolioService";
import Loading from "./Loading";
import { Box, Paper, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { toast } from "react-toastify";
import { NotificationContext } from "../contexts/NotificationContext";
import { useMediaQuery, useTheme } from "@mui/material";

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [editingStock, setEditingStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setDrawerOpen] = useState(false);
  const { addNotification } = useContext(NotificationContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const fetchedStocks = await getPortfolio();
        setStocks(fetchedStocks);
      } catch (error) {
        console.error("Error fetching portfolio stocks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const handleStockAction = async (action, stock) => {
    let newNotification;
    if (action === "added") {
      newNotification = `${stock.ticker} stock has been added to your portfolio.`;
    } else if (action === "deleted") {
      newNotification = `${stock.ticker} stock has been deleted from your portfolio.`;
    } else if (action === "updated") {
      newNotification = `${stock.ticker} stock details have been updated.`;
    } else {
      newNotification = `Action on ${stock.ticker} stock is unknown.`;
    }

    console.log(newNotification, action);
    await addNotification(newNotification, action);
  };

  const toggleDrawer = (open) => (event) => {
    setDrawerOpen(open);
  };

  if (loading) {
    return <Loading />;
  }

  const handleAddStock = async (stock) => {
    try {
      const addedStock = await addStock(stock);
      setStocks((prevStocks) => [...prevStocks, addedStock]);
      handleStockAction("added", addedStock);
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  const handleUpdateStock = async (index, updatedStockId, updatedStock) => {
    try {
      const updatedData = await updateStock(updatedStockId, updatedStock);
      setStocks((prevStocks) => {
        const newStocks = [...prevStocks];
        newStocks[index] = updatedData;
        return newStocks;
      });
      handleStockAction("updated", updatedData);
      setEditingStock(null);
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleDeleteStock = async (index) => {
    try {
      const stockToDelete = stocks[index];
      await deleteStock(stockToDelete._id);
      toast.success("Stock deleted successfully!");
      setStocks((prevStocks) => prevStocks.filter((_, i) => i !== index));
      handleStockAction("deleted", stockToDelete);
    } catch (error) {
      console.error("Error deleting stock:", error);
      toast.error("Failed to delete stock. Please try again.");
    }
  };

  const handleEditStock = (index) => {
    setEditingStock(stocks[index]);
  };

  const handleStockSubmit = (formData) => {
    if (editingStock) {
      const editingStockId = editingStock._id;
      const index = stocks.indexOf(editingStock);
      handleUpdateStock(index, editingStockId, formData);
    } else {
      handleAddStock(formData);
    }
  };

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ pt: 4, pb: 4}}>
        <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          mb: 4,
          textShadow: "2px 2px 4px rgba(255, 255, 255, 0.25)",
        }}
      >
        Portfolio Dashboard
      </Typography>
          <Paper
            elevation={3}
            sx={{
              backgroundColor: "#1e1e1e",
              borderRadius: 2,
              height: "100%",
              // minHeight: isMobile && "98rem",
              display: "flex",
              flexDirection: isMobile ? "column": "row",
              justifyContent: !isMobile && "center",
              alignItems: isMobile && "center",
              paddingBottom: "2rem",
              marginBottom: "2rem"
            }}
          >
            
            <MiniDashboard
              stocks={stocks}
              StockList={StockList}
              onEdit={handleEditStock}
              onDelete={handleDeleteStock}
              editingStock={editingStock}
              onSubmit={handleStockSubmit}
              portfolioStocks={stocks}
            />
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
