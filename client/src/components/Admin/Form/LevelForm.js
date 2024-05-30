import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
const LevelForm = ({ level, setLevel }) => {
  return (
    <FormControl fullWidth margin="normal" required>
      <InputLabel>Độ khó</InputLabel>
      <Select
        label="Độ khó"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      >
        <MenuItem value="Dễ">Dễ</MenuItem>
        <MenuItem value="Trung bình">Trung bình</MenuItem>
        <MenuItem value="Khó">Khó</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LevelForm;
