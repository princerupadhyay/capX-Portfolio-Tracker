import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "../../styles/Navbar.css";
import AccountMenu from "./AccountMenu";
import Badge from "@mui/material/Badge";
import { IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Button,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Remove";
import { NotificationContext } from "../contexts/NotificationContext";
import { isUserLoggedIn } from "../utils/isUserLoggedIn";
import { useMediaQuery } from "react-responsive";

const Navbar = ({ toggleDrawer, isDrawerOpen }) => {
  const { notifications, clearAllNotifications } =
    useContext(NotificationContext);
  const [unreadCount, setUnreadCount] = useState(notifications.length);
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn());

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    setIsLoggedIn(isUserLoggedIn());
  });

  const getIcon = (action) => {
    if (action.includes("added")) {
      return <AddIcon />;
    } else if (action.includes("updated")) {
      return <EditIcon />;
    } else if (action.includes("deleted")) {
      return <RemoveIcon />;
    } else {
      return <NotificationsIcon />;
    }
  };

  useEffect(() => {
    setUnreadCount(notifications.length);
  }, [notifications]);

  const handleClearNotifications = async () => {
    clearAllNotifications();
  };

  if (!isLoggedIn) return null;

  return (
    <div className="navbar">
      <div className="logoBox">
        <Link to="/">
          <img
            src="/logo.png"
            alt="CapX Logo"
            className="capXLogo"
            style={{ width: "auto", height: "50px" }}
          />
        </Link>
      </div>
      {!isMobile && (
        <div
          className="navLinks"
          style={{
            display: "flex",
            width: "100%",
            padding: "0.75rem",
          }}
        >
          {/* Links added to the navbar */}
          <Link
            to="/"
            className="navbar-link"
            style={{
              marginRight: "1.5rem",
              textDecoration: "none",
              color: "grey",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "white")}
            onMouseLeave={(e) => (e.target.style.color = "grey")}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="navbar-link"
            style={{
              marginRight: "1.5rem",
              textDecoration: "none",
              color: "grey",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "white")}
            onMouseLeave={(e) => (e.target.style.color = "grey")}
          >
            Dashboard
          </Link>
          <Link
            to="/stocks"
            className="navbar-link"
            style={{
              marginRight: "1.5rem",
              textDecoration: "none",
              color: "grey",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "white")}
            onMouseLeave={(e) => (e.target.style.color = "grey")}
          >
            Listed Stocks
          </Link>
        </div>
      )}
      <div className="otherIcons">
        <Tooltip
          title={
            unreadCount > 0
              ? `${unreadCount} new notifications`
              : "Notifications"
          }
          arrow
        >
          <IconButton
            size="large"
            onClick={toggleDrawer(true)}
            aria-label={`show ${unreadCount} new notifications`}
            color="inherit"
          >
            <Badge
              className="notificationIcon"
              badgeContent={unreadCount}
              color="error"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        {/* Notifications Drawer */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ marginTop: 2, paddingLeft: 2, textAlign: "center" }}
          >
            Notifications
          </Typography>

          {/* Divider to separate title and notification list */}
          <Divider />

          <div
            style={{
              width: 250,
              paddingLeft: 16,
              paddingRight: 16,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <List>
              {notifications.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No notifications" />
                </ListItem>
              ) : (
                notifications.map((notification, index) => {
                  const action = notification.type;
                  return (
                    <ListItem
                      key={index}
                      sx={{
                        paddingBottom: 1,
                        border: "1px solid grey",
                        borderRadius: "0.5rem",
                        marginBottom: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginRight: 2,
                        }}
                      >
                        {getIcon(action)} {/* Display dynamic icon */}
                      </Box>
                      <ListItemText
                        primary={notification.message}
                        sx={{
                          fontWeight: 500,
                          color: "black",
                        }}
                      />
                    </ListItem>
                  );
                })
              )}
            </List>
            {/* Clear All Button */}
            <Button
              variant="text"
              fullWidth
              onClick={handleClearNotifications}
              sx={{ marginTop: 2 }}
            >
              Clear All
            </Button>
          </div>
        </Drawer>
        <AccountMenu />
      </div>
    </div>
  );
};

export default Navbar;
