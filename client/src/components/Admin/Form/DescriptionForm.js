import React from "react";
import { TextField } from "@mui/material";
const DescriptionForm = ({ description, setDescription }) => {
  return (
    <TextField
      fullWidth
      margin="normal"
      label="Giới thiệu về món ăn"
      multiline
      rows={4}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      required
    />
  );
};

export default DescriptionForm;
