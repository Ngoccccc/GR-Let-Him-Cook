import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { Grid } from "@mui/material/";

const ErrorPage = ({ code, message }) => {
  return (
    <Layout title={code + " Error"}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <h1 className="pnf-title">{code} Error</h1>
        <h2 className="pnf-heading">{message}</h2>
        <Link to="/" className="pnf-btn">
          Quay lại trang chủ
        </Link>
      </Grid>
    </Layout>
  );
};

export default ErrorPage;
