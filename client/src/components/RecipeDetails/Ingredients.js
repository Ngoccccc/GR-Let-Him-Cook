import React from "react";
import { Grid, Typography } from "@mui/material/";
const Ingredients = ({ data }) => {
  return (
    <div>
      <Grid
        sx={{
          my: 3,
          pb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        borderBottom={1}
        borderColor="divider"
      >
        <Typography variant="h5" component="h2" fontWeight="bold">
          Thành phần
        </Typography>
        <Typography variant="h6" component="h2">
          Khẩu phần: {data.ration}
        </Typography>
      </Grid>
      {data.ingredients.map((ingredient, index) => (
        <Grid
          sx={{
            my: 2,
            pb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          borderBottom={1}
          borderColor="divider"
          key={index}
        >
          <Typography variant="h6" component="h2">
            {ingredient.name}
          </Typography>
          <Typography variant="h6" component="h2">
            {ingredient.quantity} {ingredient.unit}
          </Typography>
        </Grid>
      ))}
    </div>
  );
};

export default Ingredients;
