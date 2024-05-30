import React from "react";
import {
  Grid,
  TextField,
  Typography,
  FormControl,
  Autocomplete,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

export default function IngredientForm({
  ingredients,
  setIngredients,
  ingredientOptions,
  addIngredient,
  handleChangeIngredient,
  handleRemoveIngredient,
  validateFormIngredient,
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6">Nguyên liệu cần thiết</Typography>
      {ingredients.map((ingredient, index) => (
        <Grid fullWidth container spacing={2} key={index} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <FormControl
              fullWidth
              margin="normal"
              required
              error={!ingredient.name}
            >
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={ingredientOptions.map((option) => option.name)}
                value={ingredient.name}
                onChange={(e, newValue) =>
                  handleChangeIngredient(
                    index,
                    "_id",
                    ingredientOptions.find((option) => option.name === newValue)
                      ._id
                  )
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!ingredient.name}
                    helperText={
                      !ingredient.name && "Vui lòng chọn một nguyên liệu"
                    }
                    label={`Nguyên liệu ${index + 1}`}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <TextField
                margin="normal"
                label="Số lượng"
                type="number"
                value={ingredient.quantity}
                onChange={(e) =>
                  handleChangeIngredient(index, "quantity", e.target.value)
                }
                required
                error={ingredient.quantity <= 0}
                helperText={
                  ingredient.quantity <= 0 && "Số lượng cần lớn hơn 0"
                }
              />
              <Typography sx={{ ml: 4 }}>{ingredient.unit}</Typography>
            </Grid>
            <Grid item sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={() => handleRemoveIngredient(index)}>
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      ))}
      <Grid sx={{ display: "flex", justifyContent: "center" }}>
        <Button variant="outlined" startIcon={<Add />} onClick={addIngredient}>
          Thêm nguyên liệu
        </Button>
      </Grid>
    </Box>
  );
}
