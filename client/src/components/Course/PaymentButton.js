import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Grid,
} from "@mui/material";
import axios from "axios";
import Loading from "../Loading";
import { red, grey } from "@mui/material/colors";
import { Payments } from "@mui/icons-material";
import apiURL from "../../instances/axiosConfig";
const PaymentButton = ({ courseId, userId, name, amount }) => {
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleRegisterCourse = async () => {
    try {
      const response = await axios.post(`${apiURL}/api/v1/payment/zalopay`, {
        courseId,
        name,
        userId,
        reqAmount: amount * 1000,
      });
      console.log(response.data);

      if (response.data && response.data.order_url) {
        window.location.href = response.data.order_url;
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
    }
  };

  return (
    <>
      <Button
        variant="contained"
        size="big"
        color="success"
        onClick={() => handleClickOpen()}
      >
        Đăng ký
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          <Grid sx={{ display: "flex", justifyContent: "center" }}>
            <Payments sx={{ color: red[500], fontSize: 100 }} />
          </Grid>
          <Typography variant="h5">
            Bạn cần thanh toán <b>{amount.toLocaleString("vi-VN")}.000 VNĐ</b>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn chắc chắn muốn chuyển đến trang thanh toán
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: grey[900] }} onClick={handleClose}>
            Bỏ qua
          </Button>
          <Button onClick={handleRegisterCourse} autoFocus>
            Tiếp tục
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentButton;
