import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material/";
import RecipeCard from "./RecipeCard";
import axios from "axios";
import Loading from "../Loading";
import apiURL from "../../instances/axiosConfig";
const NewRecipe = () => {
  const [newPosts, setNewPosts] = useState([]);
  const getNewPosts = async () => {
    try {
      const { data } = await axios.get(`${apiURL}/api/v1/post/get-new-posts`);
      setNewPosts(data.posts);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getNewPosts();
  }, []);
  return (
    <div>
      <Typography
        variant="h5"
        component="h2"
        fontWeight="bold"
        borderBottom={1}
        borderColor="divider"
      >
        Công thức mới nhất
      </Typography>
      {!newPosts ? (
        <Loading />
      ) : (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {newPosts.map((recipe) => (
            <Grid key={recipe._id} item xs={4}>
              <RecipeCard recipe={recipe} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default NewRecipe;
