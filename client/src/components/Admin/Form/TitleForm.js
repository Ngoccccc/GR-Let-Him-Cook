import React from "react";
import { TextField } from "@mui/material";
const TitleForm = ({ title, setTitle }) => {
  return (
    <TextField
      fullWidth
      margin="normal"
      label="Tên món ăn"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
    />
  );
};

export default TitleForm;
