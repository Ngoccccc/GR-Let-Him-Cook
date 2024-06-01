import React from "react";
import Layout from "./../components/Layout/Layout";
import { Container, Grid, Typography, Link } from "@mui/material";

const Contact = () => {
  return (
    <Layout title={"Contact us"}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/ryouriapp.appspot.com/o/avatar%2Fzom-100_ptd7.jpg?alt=media&token=508a3c2c-6ae5-4931-9c10-ac6cefcfed3f"
              alt="Contact Us"
              style={{ width: "100%", marginBottom: "20px" }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" align="center" gutterBottom>
              CONTACT US
            </Typography>
            <Typography variant="body1" paragraph align="center">
              Mọi thắc mắc về sản phẩm, vui lòng liên hệ với chúng tôi
            </Typography>
            <Typography variant="body1" align="center">
              email: ngoc.tt205009@sis.hust.edu.vn
            </Typography>
            <Typography variant="body1" align="center">
              Phone: 0971957964
            </Typography>
            <Typography variant="body1" align="center">
              Facebook:{" "}
              <Link href="https://www.facebook.com/tienngoc2k2" color="inherit">
                www.facebook.com
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Contact;
