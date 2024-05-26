import React, { useState } from "react";
import PropTypes from "prop-types";
import { NavLink, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import { InputBase, IconButton } from "@mui/material/";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const logoStyle = {
  width: "70px",
  height: "auto",
  cursor: "pointer",
};

function AppAppBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchTerm)}`);
    }
  };
  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              borderRadius: "999px",
              bgcolor:
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.4)"
                  : "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(24px)",
              maxHeight: 40,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                theme.palette.mode === "light"
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                ml: "-18px",
                px: 0,
              }}
            >
              <img
                src={
                  "https://www.thegoodfoodguide.co.uk/img/GFG%20transparent_1.svg"
                }
                style={logoStyle}
                alt="logo of sitemark"
              />
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <MenuItem sx={{ py: "6px", px: "12px" }}>
                  <NavLink to="/" className="nav-link">
                    Trang chủ
                  </NavLink>
                </MenuItem>
                <MenuItem sx={{ py: "6px", px: "12px" }}>
                  <NavLink to="/dashboard/favorite" className="nav-link">
                    Công thức yêu thích
                  </NavLink>
                </MenuItem>
                <MenuItem sx={{ py: "6px", px: "12px" }}>
                  <NavLink to="/course" className="nav-link">
                    Khóa học nấu ăn
                  </NavLink>
                </MenuItem>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                alignItems: "center",
              }}
            >
              <Paper
                component="form"
                onSubmit={handleSearch}
                sx={{
                  p: "1px 2px",
                  display: "flex",
                  alignItems: "center",
                  width: "60%",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Tìm công thức"
                  inputProps={{ "aria-label": "search recipe" }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <IconButton type="submit" sx={{ p: "6px" }} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </Paper>
              <MenuItem sx={{ py: "6px", px: "12px" }}>
                <NavLink to="/register" className="nav-link">
                  Đăng ký
                </NavLink>
              </MenuItem>
              <MenuItem sx={{ py: "6px", px: "12px" }}>
                <NavLink to="/login" className="nav-link">
                  Đăng nhập
                </NavLink>
              </MenuItem>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

AppAppBar.propTypes = {
  mode: PropTypes.oneOf(["dark", "light"]).isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};

export default AppAppBar;
