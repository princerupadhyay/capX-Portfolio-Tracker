import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const NameModal = ({ open, onClose, onSubmit }) => {
  const [fullName, setFullName] = useState("");

  const handleInputChange = (event) => {
    setFullName(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(fullName);
    onClose();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "#1e1e1e",
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "90%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            mb: 3,
            mt: 1,
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={{ fontWeight: "bold", color: "white" }}
          >
            What’s your full name?
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          label="Full Name"
          variant="outlined"
          value={fullName}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          sx={inputStyles}
        />
        <Button
          variant="outlined"
          sx={{
            borderRadius: "1.25rem",
            borderColor: "grey",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "lightgrey",
              borderColor: "black",
              color: "black",
            },
          }}
          onClick={handleSubmit}
          style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
        >
          Let's Go
        </Button>
      </Box>
    </Modal>
  );
};

export default NameModal;
