import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import { ArrowDropDown } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import Loading from "./Loading";
import { UserContext } from "../contexts/UserContext";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, setUser, loading, setLoading } = useContext(UserContext);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const response = await axios.get("/auth/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser({
            id: response.data.user.id,
            username: response.data.user.username,
            fullName: response.data.user.fullName || "Guest",
          });
        } catch (error) {
          console.error("Error fetching user details:", error);
          localStorage.removeItem("authToken");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    fetchUserInfo();
  }, [setUser]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleClose();
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post("/auth/logout"); // Notify the backend if needed
      localStorage.removeItem("authToken"); // Remove the JWT
      setUser(null); // Reset the user context
      navigate("/login"); // Redirect to login
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const fullName = user?.fullName || "Guest";
  const firstName = fullName.split(" ")[0];

  return (
    <React.Fragment>
      <Tooltip title="Account settings" arrow>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            cursor: "pointer",
            justifyContent: "center",
          }}
          onClick={handleClick}
          style={{ marginLeft: "1rem" }}
        >
          <Avatar
            sx={{ width: 32, height: 32 }}
            alt={user?.username || "Guest"}
            src="/1.jpg"
          />
          <p
            style={{
              fontWeight: "700",
              marginLeft: "0.6rem",
              marginRight: "0.25rem",
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {isMobile ? firstName : fullName}
          </p>
          <ArrowDropDown style={{ opacity: "80%" }} />
        </Box>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleProfileClick}>
          <Avatar sx={{ width: 32, height: 32 }} /> Profile
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "0.5rem",
          }}
        >
          <ListItemIcon
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              color: "black",
            }}
          >
            <Logout
              fontSize="small"
              style={{
                backgroundColor: "gray",
                opacity: "0.45",
                borderRadius: "50%",
                padding: "0.3rem",
                color: "white",
              }}
            />
            <span style={{ marginLeft: "0.5rem" }}>Logout</span>
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
