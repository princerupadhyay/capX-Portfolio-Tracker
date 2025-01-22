import React from "react";
import { Paper, Typography, IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

const StockList = ({ stocks, onEdit, onDelete }) => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxHeight: "23rem",
          overflowY: "auto",
          pr: 1,
          mb: 3,

          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#555",
            },
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
          },
        }}
      >
        {stocks.map((stock, index) => (
          <Paper
            key={index}
            sx={{
              mb: 2,
              backgroundColor: "#444",
              borderRadius: 2,
              padding: 2,
              boxShadow: 3,
              "&:hover": {
                backgroundColor: "#555",
                cursor: "pointer",
              },
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Link
                to={`/stocks/${stock.ticker}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  flexGrow: 1,
                }}
              >
                <Box flex={1}>
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    {stock.name.toUpperCase()}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "grey" }}>
                    <strong style={{ color: "white" }}>Ticker: </strong>
                    {stock.ticker}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "grey" }}>
                    <strong style={{ color: "white" }}>Quantity: </strong>
                    {stock.quantity}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "grey" }}>
                    <strong style={{ color: "white" }}>Price: </strong>$
                    {stock.price.toFixed(2)}
                  </Typography>
                </Box>
              </Link>
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={() => onEdit(index)}
                  aria-label="edit"
                  style={{ color: "white" }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => onDelete(index)}
                  aria-label="delete"
                  style={{ color: "white" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </>
  );
};

export default StockList;
