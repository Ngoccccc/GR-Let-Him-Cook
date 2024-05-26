import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material/";
import axios from "axios";
import SameRecipeCard from "./SameRecipeCard";
import Loading from "../Loading";
const SameRecipe = ({ categories, currentPostId }) => {
  const [sameRecipes, setSameRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPosts = async () => {
    try {
      const { data } = await axios.post(`/api/v1/post/get-same-posts`, {
        categoryIds: categories.map((c) => c._id),
        currentPostId,
      });
      setSameRecipes(data.posts);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, [currentPostId]);
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {!sameRecipes ? (
        <Loading />
      ) : (
        <Grid
          sx={{
            mt: 8,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            fontWeight="bold"
            borderBottom={1}
            borderColor="divider"
            sx={{ mb: 3 }}
          >
            Món ăn tương tự
          </Typography>
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "80%",
              margin: "auto",
            }}
          >
            {sameRecipes.map((recipe) => (
              <Grid key={recipe._id} sx={{ mb: 4 }}>
                <SameRecipeCard recipe={recipe} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default SameRecipe;
