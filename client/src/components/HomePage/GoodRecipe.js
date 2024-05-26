import React from "react";
import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material/";

import {
  AccessTime as AccessTimeIcon,
  Bolt,
  FavoriteBorder,
} from "@mui/icons-material";
import RecipeCard from "./RecipeCard";

const GoodRecipe = () => {
  const cardsData = [
    {
      id: 1,
      title: "Cháo thịt heo bí đỏ",
      mediaTitle:
        "https://media.cooky.vn/recipe/g1/393/s320x240/Recipe393-635402710349446250.jpg",
      level: "Dễ",
      intendTime: "30 phút",
      likeCount: 1,
    },
    {
      id: 2,
      title: "Cá basa kho tộ",
      mediaTitle:
        "https://media.cooky.vn/recipe/g1/393/s320x240/Recipe393-635402710349446250.jpg",
      level: "Dễ",
      intendTime: "30 phút",
      likeCount: 1,
    },
    {
      id: 3,
      title: "Bún chay kiểu Huế",
      mediaTitle:
        "https://media.cooky.vn/recipe/g1/393/s320x240/Recipe393-635402710349446250.jpg",
      level: "Dễ",
      intendTime: "30 phút",
      likeCount: 1,
    },
    {
      id: 4,
      title: "Cơm chiên Dương Châu",
      mediaTitle:
        "https://media.cooky.vn/recipe/g1/393/s320x240/Recipe393-635402710349446250.jpg",
      level: "Dễ",
      intendTime: "30 phút",
      likeCount: 1,
    },
    {
      id: 5,
      title: "Bánh bông lan trà xanh",
      mediaTitle:
        "https://media.cooky.vn/recipe/g1/393/s320x240/Recipe393-635402710349446250.jpg",
      level: "Dễ",
      intendTime: "30 phút",
      likeCount: 1,
    },
    {
      id: 6,
      title: "Smoothie xoài chuối kiwi",
      mediaTitle:
        "https://media.cooky.vn/recipe/g1/393/s320x240/Recipe393-635402710349446250.jpg",
      level: "Dễ",
      intendTime: "30 phút",
      likeCount: 1,
    },
  ];
  return (
    <Grid sx={{ mt: 3 }}>
      <Typography
        variant="h5"
        component="h2"
        fontWeight="bold"
        borderBottom={1}
        borderColor="divider"
      >
        Món ngon buổi sáng
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {cardsData.map((recipe) => (
          <Grid key={recipe.id} item xs={4}>
            <RecipeCard recipe={recipe} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default GoodRecipe;
