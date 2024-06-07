import React, { useState, useEffect } from "react";
import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material/";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import Loading from "../Loading";
import apiURL from "../../instances/axiosConfig";
const FavoriteRecipe = () => {
  const [favoriteRecipe, setFavoriteRecipe] = useState([]);
  const getFavoritePosts = async () => {
    try {
      const { data } = await axios.get(
        `${apiURL}/api/v1/post/get-favorite-posts`
      );
      setFavoriteRecipe(data.posts);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFavoritePosts();
  }, []);

  const navigate = useNavigate();
  const handleTitleClick = (recipe) => {
    navigate(`/recipe-detail/${recipe._id}`);
  };
  return (
    <Grid sx={{ mt: 3 }}>
      <Typography
        variant="h5"
        component="h2"
        fontWeight="bold"
        borderBottom={1}
        borderColor="divider"
      >
        Công thức được yêu thích
      </Typography>
      {!favoriteRecipe ? (
        <Loading />
      ) : (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {favoriteRecipe.slice(0, 4).map((recipe, index) => (
            <Grid key={recipe._id} item xs={6}>
              <Card sx={{ width: "100%", height: "250px" }}>
                <CardMedia
                  component="img"
                  image={recipe.mediaTitle}
                  alt={recipe.title}
                  style={{ objectFit: "cover", width: "100%", height: "150px" }}
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleTitleClick(recipe)}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    component="h2"
                    fontWeight="bold"
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        color: "brown",
                      },
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      textOverflow: "ellipsis",
                    }}
                    onClick={() => handleTitleClick(recipe)}
                  >
                    {recipe.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Grid>
  );
};

export default FavoriteRecipe;
