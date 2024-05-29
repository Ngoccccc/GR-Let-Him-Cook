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
import { Email, Lock, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../../components/Layout/Layout";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(""); // State for email error
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

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    try {
      const res = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
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
    <Layout title="Ryouri master - Đăng ký" backgroundColor="#f0f2f5">
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
                <Person color="primary" style={{ fontSize: 60 }} />
              </Box>
              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                textAlign="center"
              >
                Đăng ký tài khoản mới
              </Typography>
              <Box mb={2}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="name"
                  label="Tên của bạn"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  InputProps={{
                    endAdornment: <Person position="end" />,
                  }}
                  required
                />
              </Box>
              <Box mb={2}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email của bạn"
                  name="email"
                  autoComplete="email"
                  type="email" // Use type="email" to leverage HTML5 validation
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
              <Box mb={2}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="confirmPassword"
                  label="Xác nhận mật khẩu"
                  type="password"
                  id="confirmPassword"
                  autoComplete="current-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                style={{ marginBottom: "1.5rem" }}
              >
                Đăng ký
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Link
                    onClick={() => navigate("/login")}
                    variant="body2"
                    underline="none"
                    style={{ cursor: "pointer" }}
                  >
                    Đã có tài khoản? Đăng nhập ngay!
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

export default Register;
