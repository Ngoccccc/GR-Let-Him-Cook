import React, { useState } from "react";
import { TextField, Autocomplete, MenuItem } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

export default function CategorySelect({ data, onSelectionChange }) {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleSelectionChange = (event, newValue) => {
    setSelectedCategories(newValue);
    onSelectionChange(newValue);
  };

  return (
    <Autocomplete
      sx={{ width: "50%" }}
      multiple
      options={data}
      getOptionLabel={(option) => option.name}
      disableCloseOnSelect
      value={selectedCategories}
      onChange={handleSelectionChange}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Chọn danh mục"
          placeholder="Chọn danh mục"
        />
      )}
      renderOption={(props, option, { selected }) => (
        <MenuItem
          {...props}
          key={option.id}
          value={option.name}
          sx={{ justifyContent: "space-between" }}
        >
          {option.name}
          {selected ? <CheckIcon color="info" /> : null}
        </MenuItem>
      )}
    />
  );
}
