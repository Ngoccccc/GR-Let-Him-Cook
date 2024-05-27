import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Avatar, Flex, Typography } from "antd";
import { Button, MenuItem, Menu, Grid } from "@mui/material/";
import { Person, ArrowDropDown, Logout } from "@mui/icons-material";
import { useAuth } from "../../../context/auth";
import { red } from "@mui/material/colors";

const CustomHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const [auth, setAuth] = useAuth();
  const handleLogout = () => {
    // Handle logout logic here
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    navigate(`/login`);
    toast.success("Đăng xuất thành công");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Flex align="center" justify="space-between">
      <Typography.Title level={3}>Đây là tài khoản admin! 😎</Typography.Title>

      <Grid
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={handleProfile}
          sx={{
            borderRadius: "10%",
            textTransform: "none",
            color: "#000",
            padding: "6px",
          }}
        >
          <Person />
          {auth.user.name}
          <ArrowDropDown />
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem sx={{ color: red[500] }} onClick={handleLogout}>
            <Logout />
            Đăng xuất
          </MenuItem>
        </Menu>
      </Grid>
    </Flex>
  );
};

export default CustomHeader;
