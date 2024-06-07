import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material/";
import axios from "axios";
import RecipeCard from "./RecipeCard";

const GoodRecipe = () => {
  const [bunPosts, setBunPosts] = useState([]);

  const getBunPost = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/post/get-post-by-category/bun-mi-pho`
      );
      setBunPosts(data.postOfCategory);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBunPost();
  }, []);

  return (
    <>
      {bunPosts?.length > 0 ? (
        <Grid sx={{ mt: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            fontWeight="bold"
            borderBottom={1}
            borderColor="divider"
          >
            Bún Mì Phở
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {bunPosts.slice(0, 5).map((recipe) => (
              <Grid key={recipe.postId.id} item xs={4}>
                <RecipeCard recipe={recipe.postId} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      ) : (
        <></>
      )}
    </>
  );
};

export default GoodRecipe;
