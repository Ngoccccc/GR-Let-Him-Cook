import React from "react";
import { Link } from "react-router-dom";
import { Grid } from "@mui/material/";

const ErrorPage = ({ code, message, role }) => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      sx={{ mt: 13 }}
    >
      <h1 className="pnf-title">{code} Error</h1>
      <h2 className="pnf-heading">{message}</h2>
      <Link to={`/${role}/posts`} className="pnf-btn">
        Quay lại quản lý hướng dẫn nấu ăn
      </Link>
    </Grid>
  );
};

export default ErrorPage;
