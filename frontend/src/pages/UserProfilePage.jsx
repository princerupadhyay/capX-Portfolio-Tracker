import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { UserContext } from "../contexts/UserContext";

// Function to get JWT token from localStorage
const getToken = () => {
  return localStorage.getItem("authToken");
};

const UserProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    username: "",
    email: "",
    fullName: "",
  });
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
        setUpdatedUser({
          username: response.data.user.username,
          email: response.data.user.email,
          fullName: response.data.user.fullName || "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(false);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [setUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!updatedUser.username || !updatedUser.email || !updatedUser.fullName) {
      setError("All fields are required!");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const token = getToken();
      const response = await axios.put("/auth/update", updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setSnackbarMessage("Profile updated successfully!");
        setOpenSnackbar(true);
        setUser(updatedUser); // Immediately update user context

        setLoading(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setSnackbarMessage("Failed to update profile.");
      setOpenSnackbar(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          p: 4,
          m: 4,
          backgroundColor: "#444",
          color: "white",
          textAlign: "center",
        }}
        style={{ borderRadius: "1rem" }}
      >
        <Typography variant="h4" gutterBottom color="white">
          Welcome, {user.username}
        </Typography>

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            name="username"
            value={updatedUser.username}
            onChange={handleChange}
            sx={{
              marginBottom: 2,
              input: { color: "white" },
              "& .MuiOutlinedInput-root": {
                borderColor: "white",
                borderRadius: "0.5rem",
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
            }}
          />

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={updatedUser.email}
            onChange={handleChange}
            sx={{
              marginBottom: 2,
              input: { color: "white" },
              "& .MuiOutlinedInput-root": {
                borderColor: "white",
                borderRadius: "0.5rem",
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
            }}
          />

          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            name="fullName"
            value={updatedUser.fullName}
            onChange={handleChange}
            sx={{
              marginBottom: 2,
              input: { color: "white" },
              "& .MuiOutlinedInput-root": {
                borderColor: "white",
                borderRadius: "0.5rem",
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
            }}
          />

          <Button
            variant="outlined"
            type="submit"
            sx={{
              borderRadius: "1.25rem",
              borderColor: "grey",
              textTransform: "none",
              p1: 1,
              "&:hover": {
                backgroundColor: "lightgrey",
                borderColor: "black",
                color: "black",
              },
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update"
            )}
          </Button>
        </form>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarMessage.includes("success") ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default UserProfilePage;
