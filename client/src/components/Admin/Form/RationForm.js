import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
const RationForm = ({ ration, setRation }) => {
  return (
    <FormControl fullWidth margin="normal" required>
      <InputLabel>Khẩu phần ăn</InputLabel>
      <Select
        label="Khẩu phần ăn"
        value={ration}
        onChange={(e) => setRation(e.target.value)}
      >
        <MenuItem value="1 người">1 người</MenuItem>
        <MenuItem value="2 người">2 người</MenuItem>
        <MenuItem value="3 người">3 người</MenuItem>
        <MenuItem value="4 người">4 người</MenuItem>
        <MenuItem value="5 người">5 người</MenuItem>
        <MenuItem value="6 người">6 người</MenuItem>
        <MenuItem value="7 người">7 người</MenuItem>
        <MenuItem value="8 người">8 người</MenuItem>
      </Select>
    </FormControl>
  );
};

export default RationForm;
