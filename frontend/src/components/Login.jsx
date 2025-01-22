import React, { useState, useContext } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Loading from "./Loading";
import { Button, Typography, Box, TextField } from "@mui/material";
import * as Yup from "yup";
import NameModal from "./NameModal";
import { UserContext } from "../contexts/UserContext";

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("*Required"),
    password: Yup.string().required("*Required"),
  });

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://capx-portfolio-tracker.onrender.com/auth/login",
        values
      );

      const { fullName } = response.data.user;
      const { authToken } = response.data;

      if (authToken) {
        localStorage.setItem("authToken", authToken);

        const loginEvent = new Event("login");
        window.dispatchEvent(loginEvent);
      }

      if (!fullName) {
        setNameModalOpen(true);
      } else {
        setUser((prevUser) => ({
          ...prevUser,
          fullName: fullName,
        }));
        const redirectPath = searchParams.get("redirect") || "/dashboard";
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      const err =
        error.response && error.response.data
          ? error.response.data
          : "An unexpected error occurred";
      const msg = err.message || err;
      toast.error(msg, { theme: "dark" });
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleNameSubmit = async (name) => {
    setLoading(true);
    console.log("Entered");
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("User is not authenticated.");
      }

      await axios.put(
        "https://capx-portfolio-tracker.onrender.com/auth/update-name",
        {
          fullName: name,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("Updated");
      setUser((prevUser) => ({
        ...prevUser,
        fullName: name,
      }));
      setNameModalOpen(false);
      console.log("On way to redirect");
      const redirectPath = searchParams.get("redirect") || "/dashboard";
      navigate(redirectPath, { replace: true });
    } catch (error) {
      const err =
        error.response && error.response.data
          ? error.response.data
          : "An unexpected error occurred";
      const msg = err.message || err;
      console.log("Error:", error);
      toast.error(msg, { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box
                component="div"
                sx={{
                  backgroundColor: "#333",
                  borderRadius: 2,
                  maxWidth: 400,
                  minWidth: 200,
                  mx: "auto",
                  p: 3,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    mb: 2,
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
                  }}
                >
                  Login
                </Typography>

                <div>
                  <Field
                    as={TextField}
                    fullWidth
                    label="E-mail"
                    type="email"
                    name="email"
                    sx={autocompleteStyles}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    style={errorStyle}
                  />
                </div>
                <br />
                <div>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Password"
                    type="password"
                    name="password"
                    sx={autocompleteStyles}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    style={errorStyle}
                  />
                </div>
                <br />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1rem",
                    padding: "0.25rem",
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: "1.25rem",
                      paddingLeft: "1.5rem",
                      paddingRight: "1.5rem",
                      borderColor: "grey",
                      textTransform: "none",
                      fontSize: "1rem",
                      marginRight: "2rem",
                      "&:hover": {
                        backgroundColor: "lightgrey",
                        borderColor: "black",
                        color: "black",
                      },
                    }}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Login
                  </Button>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/register");
                    }}
                    style={{ color: "#1976d2" }}
                  >
                    Create an account?
                  </a>
                </div>
              </Box>
            </Form>
          )}
        </Formik>
      )}
      <NameModal
        open={nameModalOpen}
        onClose={() => setNameModalOpen(false)}
        onSubmit={handleNameSubmit}
      />
    </>
  );
};

export default Login;

// Error message styling
const errorStyle = {
  color: "#D2042D",
  textAlign: "right",
  paddingRight: "0.5rem",
};

const autocompleteStyles = {
  mt: 1,
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
    backgroundColor: "#1E1E1E",
    padding: "0 8px",
    borderRadius: "0.25rem",
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
