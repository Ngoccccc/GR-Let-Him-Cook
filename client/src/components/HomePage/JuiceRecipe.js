import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material/";
import axios from "axios";

import RecipeCard from "./RecipeCard";

const JuiceRecipe = () => {
  const [juicePosts, setJuicePosts] = useState([]);
  const getJuicePost = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/post/get-post-by-category/thuc-uong`
      );
      setJuicePosts(data.postOfCategory);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getJuicePost();
  }, []);
  return (
    <Grid sx={{ mt: 3 }}>
      <Typography
        variant="h5"
        component="h2"
        fontWeight="bold"
        borderBottom={1}
        borderColor="divider"
      >
        Thức uống ngon mát
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {juicePosts.slice(0, 5).map((recipe) => (
          <Grid key={recipe.postId.id} item xs={4}>
            <RecipeCard recipe={recipe.postId} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default JuiceRecipe;
