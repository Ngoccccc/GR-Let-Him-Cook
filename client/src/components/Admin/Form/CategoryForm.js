import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import MultiSelect from "../../MultiSelect";

const CategoryForm = ({
  selectedCategories,
  categoryOptions,
  handleSelectionChange,
}) => {
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6">Danh mục của món ăn</Typography>
      <Grid sx={{ my: 2 }}>
        <MultiSelect
          data={categoryOptions}
          value={selectedCategories} // Truyền giá trị đã chọn vào MultiSelect
          onSelectionChange={handleSelectionChange}
        />
      </Grid>
    </Box>
  );
};

export default CategoryForm;
