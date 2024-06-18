import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Helmet } from "react-helmet";
import { Box, Grid } from "@mui/material/";
import { Toaster } from "react-hot-toast";

const Layout = ({
  children,
  title,
  description,
  keywords,
  author,
  backgroundColor,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <title>{title}</title>
        <meta name="keywords" content={keywords} />
      </Helmet>
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          backgroundColor: backgroundColor,
          minHeight: "70vh",
        }}
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ display: "flex", width: "80%", margin: "auto" }}
        >
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            sx={{ mt: 13, mb: 3 }}
          >
            <Toaster />
            {children}
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

Layout.defaultProps = {
  title: "Chào mừng đến với Ryouri master",
  description: "mern stack project",
  keywords: "mern,react,node,mongodb",
  backgroundColor: "#ffffff",
};

export default Layout;
