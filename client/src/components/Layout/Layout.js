import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Helmet } from "react-helmet";
import { Grid, Typography } from "@mui/material/";

import { Toaster } from "react-hot-toast";
const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>
      <Header />
      <main style={{ minHeight: "70vh" }}>
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
      </main>
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "Chào các chứng thủ",
  description: "mern stack project",
  keywords: "mern,react,node,mongodb",
};

export default Layout;
