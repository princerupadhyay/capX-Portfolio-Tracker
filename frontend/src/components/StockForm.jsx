import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { InputAdornment } from "@mui/material";
import { SmallLoadingLight } from "./LoadingVariants";
import { toast } from "react-toastify";
import { useMediaQuery, useTheme } from "@mui/material";
import { fetchStockPrice } from "../api/portfolioService";

const StockForm = ({ onSubmit, editingStock, portfolioStocks, backToList }) => {
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    quantity: 0,
    price: 0,
    purchaseAmount: 0,
  });
  const [errors, setErrors] = useState({
    quantity: "",
    purchaseAmount: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const stockList = [
    { name: "Apple", ticker: "AAPL" },
    { name: "Microsoft", ticker: "MSFT" },
    { name: "Google", ticker: "GOOGL" },
    { name: "Tesla", ticker: "TSLA" },
    { name: "Amazon", ticker: "AMZN" },
    { name: "Meta", ticker: "META" },
    { name: "Netflix", ticker: "NFLX" },
    { name: "NVIDIA", ticker: "NVDA" },
    { name: "Intel", ticker: "INTC" },
    { name: "AMD", ticker: "AMD" },
  ];

  const availableStocks = stockList.filter(
    (stock) =>
      !portfolioStocks.some(
        (portfolioStock) => portfolioStock.ticker === stock.ticker
      )
  );

  useEffect(() => {
    if (editingStock) {
      setFormData({
        id: editingStock._id,
        name: editingStock.name,
        ticker: editingStock.ticker,
        quantity: editingStock.quantity,
        price: editingStock.price,
        purchaseAmount: editingStock.purchaseAmount || 0,
      });
    }
  }, [editingStock]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]: value,
      };

      if (name === "purchaseAmount") {
        const purchaseAmount = parseFloat(value);

        if (purchaseAmount > 0 && prev.price > 0) {
          updatedFormData.quantity = (purchaseAmount / prev.price).toFixed(2);
        } else if (purchaseAmount <= 0) {
          updatedFormData.quantity = 0;
        }
      }

      return updatedFormData;
    });

    setErrors((prev) => {
      const updatedErrors = { ...prev };

      if (name === "purchaseAmount") {
        const purchaseAmount = parseFloat(value);
        if (purchaseAmount <= 0 || isNaN(purchaseAmount)) {
          updatedErrors.purchaseAmount =
            "Purchase amount must be a positive number.";
        } else {
          updatedErrors.purchaseAmount = "";
        }
      }

      if (name === "quantity") {
        const quantity = parseFloat(value);
        if (quantity <= 0 || isNaN(quantity)) {
          updatedErrors.quantity = "Quantity must be a positive number.";
        } else {
          updatedErrors.quantity = "";
        }
      }

      return updatedErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      onSubmit(formData);
      toast.success(
        editingStock
          ? "Stock updated successfully!"
          : "Stock added successfully!"
      );

      setFormData({
        name: "",
        ticker: "",
        quantity: 0,
        price: 0,
        purchaseAmount: 0,
      });
      backToList();
    } catch (error) {
      console.error("Error submitting stock:", error);
      alert("Failed to submit stock. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStockSelection = async (event, selectedStock) => {
    if (!selectedStock) return;

    const { name, ticker } = selectedStock;
    setFormData((prev) => ({
      ...prev,
      name: name,
      ticker: ticker,
    }));

    setLoading(true);
    try {
      const response = await fetchStockPrice(ticker);
      if (response) {
        const currentPrice = parseFloat(response.currentPrice);
        setFormData((prev) => ({
          ...prev,
          price: currentPrice,
          quantity: prev.purchaseAmount
            ? (prev.purchaseAmount / currentPrice).toFixed(2)
            : prev.quantity,
        }));
      }
    } catch (error) {
      console.error("Error fetching stock price:", error);
      alert("Failed to fetch stock price. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    mb: 3,
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#1E1E1E",
      color: "#FFFFFF",
      borderRadius: "2rem",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#CCCCCC",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#444444",
      },
    },
    "& .MuiOutlinedInput-root.Mui-disabled": {
      backgroundColor: "#1E1E1E",
      "& input": {
        WebkitTextFillColor: "#FFFFFF",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#FFFFFF",
      backgroundColor: "#696969",
      padding: "0 8px",
      borderRadius: "0.25rem",
      transform: "translate(14px, -9px) scale(0.75)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "white",
      backgroundColor: "#1976d2",
    },
    "& .MuiInputLabel-root.Mui-disabled": {
      backgroundColor: "#696969",
      color: "#B0B0B0",
    },
  };

  const autocompleteStyles = {
    mb: 3,
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#1E1E1E",
      color: "#FFFFFF",
      borderRadius: "2rem",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#CCCCCC",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#444444",
      },
    },
    "& .MuiInputLabel-root": {
      color: "grey",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "white",
      backgroundColor: "#1976d2",
      transform: "translate(14px, -9px) scale(0.75)",
      borderRadius: "0.25rem",
      padding: "0 8px",
    },
    "& .MuiInputLabel-root.Mui-disabled": {
      backgroundColor: "#696969",
      color: "#B0B0B0",
    },
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        backgroundColor: "#333",
        borderRadius: 2,
        maxWidth: 400,
        minWidth: 200,
        color: "black",
        mx: "auto",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "white",
          textAlign: "center",
          mb: 2,
        }}
        gutterBottom
      >
        {editingStock ? "Edit" : "Add"} Stock
      </Typography>

      <Autocomplete
        freeSolo
        value={formData.name ? `${formData.name} (${formData.ticker})` : ""}
        options={availableStocks.map(
          (option) => `${option.name} (${option.ticker})`
        )}
        onInputChange={(event, newValue) => {
          if (editingStock) return;
          const selectedStock = availableStocks.find(
            (stock) => `${stock.name} (${stock.ticker})` === newValue
          );
          if (selectedStock) {
            handleStockSelection(event, selectedStock);
          } else {
            setFormData((prev) => ({
              ...prev,
              name: newValue,
              ticker: "",
            }));
          }
        }}
        disabled={!!editingStock}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Enter Stock Name"
            required
            sx={editingStock ? inputStyles : autocompleteStyles}
            style={editingStock && { color: "white" }}
          />
        )}
      />

      <div style={{ display: !isMobile && "flex", }}>
        <TextField
          label="Stock Price ($)"
          type="number"
          value={formData.price}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <span style={{ color: "#FFFFFF" }}>$</span>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <span style={{ color: "#FFFFFF" }}>per unit</span>
              </InputAdornment>
            ),
            inputComponent: loading ? SmallLoadingLight : undefined,
          }}
          fullWidth
          sx={inputStyles}
          disabled={loading}
          style={{ marginRight: !isMobile && "0.5rem" }}
        />

        <TextField
          label="Quantity (Calculated)"
          type="number"
          value={formData.quantity}
          InputProps={{
            readOnly: true,
          }}
          error={!!errors.quantity}
          helperText={errors.quantity}
          fullWidth
          sx={inputStyles}
          style={{ marginLeft: !isMobile && "0.5rem" }}
        />
      </div>

      <TextField
        label="Purchase Amount ($)"
        type="number"
        name="purchaseAmount"
        value={formData.purchaseAmount || ""}
        onChange={handleChange}
        error={!!errors.purchaseAmount}
        helperText={errors.purchaseAmount}
        fullWidth
        sx={autocompleteStyles}
      />

      <LoadingButton
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ py: 1.5, borderRadius: "2rem", }}
        loading={submitting}
        loadingIndicator={<SmallLoadingLight />}
        disabled={submitting}
      >
        {editingStock ? "Update" : "Add"}{" "}
      </LoadingButton>
    </Box>
  );
};

export default StockForm;
