// components/Loading.js
import React from "react";
import { CircularProgress, Box } from "@mui/material";

const Loading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <CircularProgress sx={{ fontSize: 300 }} />
    </Box>
  );
};

export default Loading;
