import React from "react";
import Layout from "./../components/Layout/Layout";
import { Container, Grid, Typography } from "@mui/material";

const About = () => {
  return (
    <Layout title={"About us - Ryouri master"}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/ryouriapp.appspot.com/o/avatar%2Fanhdautien.jpg?alt=media&token=59f2d3cb-5fc6-4f00-9290-891ca91abe6f"
              alt="About Us"
              style={{ width: "100%", marginBottom: "20px" }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Về người phát triển
            </Typography>
            <Typography variant="body1" paragraph>
              Hello everyone, Today I feel so good
              <br /> Mình là Ngọc
              <br /> Hiện đang học tập ở Bách khoa
              <br /> Mình rất thích nấu ăn và ẩm thực. Vì vậy mình đã lấy cảm
              hứng đó để đưa vào đồ án tốt nghiệp của mình
            </Typography>
            <Typography variant="h5" gutterBottom>
              Project Overview
            </Typography>
            <Typography variant="body1" paragraph>
              Tên của website <b>Let Him Cook</b>
              <br /> Đây là website mà bạn có thể:
              <br /> - Tìm kiếm các món ăn theo tên hoặc danh mục hoặc nguyên
              liệu
              <br /> - Xem các món ăn theo danh mục
              <br /> - Xem chi tiết cách làm
              <br /> - Xem các món ăn tương tự
              <br /> - Đăng kí khóa học nấu ăn bởi các đầu bếp chuyên nghiệp
              (hiện chưa có ai)
              <br /> - Trở thành đầu bếp đăng khóa học và kiếm tiền
              <br /> - Và rất nhiều chức năng khác nữa
            </Typography>
            <Typography variant="h5" gutterBottom>
              Our Team
            </Typography>
            <Typography variant="body1" paragraph>
              Hitoride
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default About;
