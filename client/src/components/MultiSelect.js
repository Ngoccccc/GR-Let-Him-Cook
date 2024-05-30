import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, MenuItem } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

export default function CategorySelect({ value, data, onSelectionChange }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [uniqueData, setUniqueData] = useState([]);
  const handleSelectionChange = (event, newValue) => {
    setSelectedCategories(newValue);
    onSelectionChange(newValue);
  };

  useEffect(() => {
    // Đảm bảo data được truyền xuống trước khi tính toán uniqueData
    if (data && data.length > 0) {
      // Lọc ra các danh mục không trùng lặp và chưa được chọn
      const filteredData = data.filter((category) => {
        return !selectedCategories.some(
          (selectedOption) => selectedOption._id === category._id
        );
      });
      setUniqueData(filteredData);
    }
  }, [data, selectedCategories]);
  useEffect(() => {
    setSelectedCategories(value || []);
  }, [value]);
  return (
    <Autocomplete
      sx={{ width: "50%" }}
      multiple
      options={uniqueData}
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
          key={option._id}
          value={option}
          sx={{ justifyContent: "space-between" }}
        >
          {option.name}
          {selected ? <CheckIcon color="info" /> : null}
        </MenuItem>
      )}
    />
  );
}
