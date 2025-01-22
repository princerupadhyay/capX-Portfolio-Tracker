import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { Box } from "@mui/material";

export default function BottomAppBar() {
  const [activeIcon, setActiveIcon] = React.useState("/dashboard");
  const navigate = useNavigate();

  const handleIconClick = (icon) => {
    setActiveIcon(icon);
    navigate(icon);
  };

  return (
    <React.Fragment>
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          top: "auto",
          bottom: 0,
          backgroundColor: "#292929",
        }}
        style={{
          borderTopLeftRadius: "2rem",
          borderTopRightRadius: "2rem",
          marginBottom: "-0.1rem",
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <IconButton
              sx={{
                color: activeIcon === "/" ? "white" : "grey",
                transform: activeIcon === "/" ? "scale(2)" : "scale(1)",
                transition: "transform 0.3s ease",
              }}
              component={Link}
              to="/"
              aria-label="home"
              onClick={() => handleIconClick("/")}
            >
              <HomeIcon />
            </IconButton>
            <IconButton
              sx={{
                color: activeIcon === "/dashboard" ? "white" : "grey",
                transform:
                  activeIcon === "/dashboard" ? "scale(2)" : "scale(1)",
                transition: "transform 0.3s ease",
                marginLeft: "1rem",
                marginRight: "1rem",
              }}
              component={Link}
              to="/dashboard"
              aria-label="dashboard"
              onClick={() => handleIconClick("/dashboard")}
            >
              <DashboardIcon />
            </IconButton>
            <IconButton
              sx={{
                color: activeIcon === "/stocks" ? "white" : "grey",
                transform: activeIcon === "/stocks" ? "scale(2)" : "scale(1)",
                transition: "transform 0.3s ease",
              }}
              component={Link}
              to="/stocks"
              aria-label="listed stocks"
              onClick={() => handleIconClick("/stocks")}
            >
              <ListAltIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
