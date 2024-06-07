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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import { Email, Lock, Security } from "@mui/icons-material";
import removeVietnameseTones from "../../utils/removeVietnameseTones";
import apiURL from "../../instances/axiosConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Thêm state cho xác nhận mật khẩu
  const [answer, setAnswer] = useState("");
  const [emailError, setEmailError] = useState(""); // State cho lỗi email
  const [passwordError, setPasswordError] = useState(""); // State cho lỗi xác nhận mật khẩu

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra email hợp lệ
    if (!validateEmail(email)) {
      setEmailError("Email không hợp lệ");
      return;
    } else {
      setEmailError("");
    }

    // Kiểm tra xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp");
      return;
    } else {
      setPasswordError("");
    }

    try {
      const res = await axios.post(`${apiURL}/api/v1/auth/forgot-password`, {
        email,
        newPassword,
        answer: removeVietnameseTones(answer.toLowerCase()),
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError("Email không hợp lệ");
    } else {
      setEmailError("");
    }
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (e.target.value !== confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== newPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp");
    } else {
      setPasswordError("");
    }
  };

  return (
    <Layout title="VERSACE - Quên mật khẩu">
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: "80vh",
          backgroundColor: "#f0f2f5",
          padding: "2rem",
        }}
      >
        <Grid item xs={12} sm={8} md={6} lg={5}>
          <Paper elevation={6} style={{ padding: "2.5rem" }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box display="flex" justifyContent="center" mb={2}>
                <Lock color="primary" style={{ fontSize: 60 }} />
              </Box>
              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                textAlign="center"
              >
                Đặt lại mật khẩu
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
                  name="answer"
                  label="Món ăn yêu thích của bạn"
                  type="text"
                  id="answer"
                  autoComplete="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  InputProps={{
                    endAdornment: <Security position="end" />,
                  }}
                  required
                />
                <Typography variant="caption" color="textSecondary">
                  Chú ý, đây là câu hỏi bảo mật để bạn có thể khôi phục mật khẩu
                </Typography>
              </Box>
              <Box mb={2}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="newPassword"
                  label="Mật khẩu mới"
                  type="password"
                  id="newPassword"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  InputProps={{
                    endAdornment: <Lock position="end" />,
                  }}
                  required
                  error={!!passwordError && newPassword !== ""}
                  helperText={
                    passwordError && newPassword !== "" ? passwordError : ""
                  }
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
                  autoComplete="confirm-password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  InputProps={{
                    endAdornment: <Lock position="end" />,
                  }}
                  required
                  error={!!passwordError && confirmPassword !== ""}
                  helperText={
                    passwordError && confirmPassword !== "" ? passwordError : ""
                  }
                />
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginBottom: "1.5rem" }}
              >
                Đặt lại
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

export default ForgotPassword;
