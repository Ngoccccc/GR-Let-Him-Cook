import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Link,
} from "@mui/material";
import { Email, Lock, SoupKitchen } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import Layout from "./../../components/Layout/Layout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(""); // State for email error
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Email không hợp lệ");
      return;
    } else {
      setEmailError("");
    }

    try {
      const res = await axios.post("/api/v1/auth/login", { email, password });
      if (res && res.data.success) {
        toast.success(res.data.message);
        setAuth({ ...auth, user: res.data.user, token: res.data.token });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(res.data.user.role === "admin" ? "/admin/category" : "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (validateEmail(value)) {
      setEmailError("");
    } else {
      setEmailError("Email không hợp lệ");
    }
  };

  return (
    <Layout title="Ryouri master - Đăng nhập" backgroundColor="#f0f2f5">
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: "80vh",
          padding: "2rem",
        }}
      >
        <Grid item xs={12} sm={8} md={6} lg={5}>
          <Paper elevation={6} style={{ padding: "2.5rem" }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box display="flex" justifyContent="center" mb={2}>
                <SoupKitchen color="primary" style={{ fontSize: 60 }} />
              </Box>
              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                textAlign="center"
              >
                Đăng nhập
              </Typography>
              <Box mb={2}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email của bạn"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  InputProps={{
                    endAdornment: <Email position="end" />,
                  }}
                  required
                  error={!!emailError && email !== ""}
                  helperText={emailError && email !== "" ? emailError : ""}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Mật khẩu"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: <Lock position="end" />,
                  }}
                  required
                />
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginBottom: "1.5rem" }} // Thêm khoảng cách phía dưới nút đăng nhập
              >
                Đăng nhập
              </Button>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Link
                    onClick={() => navigate("/forgot-password")}
                    variant="body2"
                    underline="none"
                    style={{ cursor: "pointer" }}
                  >
                    Quên mật khẩu?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    onClick={() => navigate("/register")}
                    variant="body2"
                    underline="none"
                    style={{ cursor: "pointer" }}
                  >
                    Chưa có tài khoản? Đăng kí ngay!
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Login;
