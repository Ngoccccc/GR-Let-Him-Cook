import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Grid,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../../context/auth";
import Layout from "./../../components/Layout/Layout";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isRequestSent, setIsRequestSent] = useState("");
  const [auth] = useAuth();
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  useEffect(() => {
    setUser(auth?.user);
    setIsRequestSent(auth?.user.role === "chef");
    getRequestStatus();
  }, [auth?.token]);

  const getRequestStatus = async () => {
    try {
      const res = await axios.get("/api/v1/user/get-request-status");
      console.log(res);
      if (res.data.status) {
        setIsRequestSent(res.data.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRequestRoleChange = async () => {
    try {
      const res = await axios.post("/api/v1/user/request-role-change", {
        phone,
        roleRequestReason: reason,
      });
      if (res.data.message) {
        setIsRequestSent(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <Layout title="Profile" backgroundColor="#f0f2f5">
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
          <Paper
            elevation={6}
            style={{ padding: "2.5rem", textAlign: "center" }}
          >
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{ width: 100, height: 100, margin: "auto" }}
            />
            <Typography variant="h5" component="h1" gutterBottom>
              {user.name}
            </Typography>

            {isRequestSent === "waiting" ? (
              <Typography variant="body1" color="textSecondary">
                Đang Đợi Admin xác nhận trở thành đầu bếp
              </Typography>
            ) : (
              <>
                {isRequestSent === "rejected" || isRequestSent == "" ? (
                  <>
                    {isRequestSent === "rejected" && (
                      <Typography component="h1" gutterBottom>
                        Bạn đã bị từ chối lên đầu bếp. Tuy nhiên đừng nản chí,
                        hãy yêu cầu thêm
                      </Typography>
                    )}

                    <Typography component="h1" gutterBottom>
                      Trở thành đầu bếp để có thể đăng bài hướng dẫn nấu ăn và
                      kiếm tiền từ đăng khóa học
                    </Typography>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="Số điện thoại"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="Lý do muốn trở thành đầu bếp"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                      multiline
                      rows={4}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleRequestRoleChange}
                    >
                      Yêu cầu trở thành đầu bếp
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography component="h1" gutterBottom>
                      Bạn đã được phê duyệt làm đầu bếp. Giờ đây hãy chuyển sang
                      trang đầu bếp để xem thêm nha
                    </Typography>
                    <Button variant="contained" color="primary">
                      Sang trang đầu bếp
                    </Button>
                  </>
                )}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Profile;
