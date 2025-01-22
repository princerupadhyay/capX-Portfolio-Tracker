import React, { useState } from "react";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Box, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const validationSchema = Yup.object({
  username: Yup.string()
    .required("*Required")
    .test("Unique-username", "*Username already taken", async (value) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/auth/newUsername",
          { username: value }
        );
        console.log("API response:", response.data);
        return response.data.isUnique;
      } catch (error) {
        console.error("Error validating username:", error);
        return false;
      }
    }),
  email: Yup.string().email("*Invalid email address").required("*Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("*Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "*Passwords must match")
    .required("*Required"),
});

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
        "http://localhost:3000/auth/register",
        values
      );
      navigate("/login");
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data
          : "An unexpected error occurred";
      console.error("Registration error:", message);
      toast.error(message, { theme: "dark" });
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          noValidate
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
                    mb: 1,
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
                  }}
                  gutterBottom
                >
                  Register
                </Typography>

                <div>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Username"
                    name="username"
                    sx={autocompleteStyles}
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    style={{
                      color: "#D2042D",
                      textAlign: "right",
                      paddingRight: "0.5rem",
                    }}
                  />
                </div>

                <div>
                  <Field
                    as={TextField}
                    fullWidth
                    label="E-mail"
                    name="email"
                    sx={autocompleteStyles}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    style={{
                      color: "#D2042D",
                      textAlign: "right",
                      paddingRight: "0.5rem",
                    }}
                  />
                </div>

                <div style={{ display: "flex" }}>
                  <div>
                    <Field
                      as={TextField}
                      fullWidth
                      type="password"
                      label="Password"
                      name="password"
                      sx={autocompleteStyles}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      style={{
                        color: "#D2042D",
                        textAlign: "right",
                        paddingRight: "0.5rem",
                      }}
                    />
                  </div>

                  <div>
                    <Field
                      as={TextField}
                      fullWidth
                      type="password"
                      label="Confirm Password"
                      name="confirmPassword"
                      sx={autocompleteStyles}
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      style={{
                        color: "#D2042D",
                        textAlign: "right",
                        paddingRight: "0.5rem",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1rem",
                    padding: "0.25rem",
                  }}
                >
                  <LoadingButton
                    variant="outlined"
                    sx={{
                      textAlign: "center",
                      borderRadius: "2rem",
                      borderColor: "grey",
                      textTransform: "none",
                      borderWidth: "2px",
                      pl: 3,
                      pr: 3,
                      pt: 1,
                      pb: 1,
                      fontSize: "1rem",

                      "&:hover": {
                        backgroundColor: "lightgrey",
                        borderColor: "black",
                        color: "black",
                      },
                    }}
                    type="submit"
                    loading={isSubmitting}
                    loadingIndicator={<Loading />}
                    disabled={isSubmitting}
                  >
                    Register
                  </LoadingButton>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/login");
                    }}
                  >
                    Already an user?
                  </a>
                </div>
              </Box>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default Register;

const autocompleteStyles = {
  mt: 2,
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
