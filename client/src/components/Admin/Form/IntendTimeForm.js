import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const IntendTimeForm = ({ intendTime, setIntendTime }) => {
  return (
    <FormControl fullWidth margin="normal" required>
      <InputLabel>Thời gian thực hiện</InputLabel>
      <Select
        label="Thời gian thực hiện"
        value={intendTime}
        onChange={(e) => setIntendTime(e.target.value)}
      >
        <MenuItem value="15 phút">15 phút</MenuItem>
        <MenuItem value="30 phút">30 phút</MenuItem>
        <MenuItem value="45 phút">45 phút</MenuItem>
        <MenuItem value="1 giờ">1 giờ</MenuItem>
        <MenuItem value="1.5 giờ">1.5 giờ</MenuItem>
        <MenuItem value="2 giờ">2 giờ</MenuItem>
      </Select>
    </FormControl>
  );
};

export default IntendTimeForm;
