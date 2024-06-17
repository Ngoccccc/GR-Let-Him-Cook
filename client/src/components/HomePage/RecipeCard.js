import React, { useState, useEffect } from "react";
import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material/";
import {
  AccessTime as AccessTimeIcon,
  Bolt,
  FavoriteBorder,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import apiURL from "../../instances/axiosConfig";
const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(recipe.likeCount);

  const handleTitleClick = () => {
    navigate(`/recipe-detail/${recipe._id}`);
  };
  const checkLiked = async (postId) => {
    try {
      console.log(postId);
      const { data } = await axios.get(
        `${apiURL}/api/v1/like/like-status/${postId}`
      );

      setLiked(data.liked);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (recipe._id && auth?.token) checkLiked(recipe._id);
  }, []);

  const handleLikeClick = async () => {
    try {
      if (auth?.token) {
        const url = liked
          ? `${apiURL}/api/v1/like/unlike-post/${recipe._id}`
          : `${apiURL}/api/v1/like/like-post/${recipe._id}`;

        const { data } = await axios.post(url);
        setLiked(data.liked);
        setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Card sx={{ width: "100%" }}>
      <CardMedia
        component="img"
        image={recipe.mediaTitle}
        alt={recipe.title}
        style={{ objectFit: "cover", width: "100%", height: "200px" }}
        sx={{
          cursor: "pointer",
        }}
        onClick={handleTitleClick}
      />
      <CardContent>
        <Typography
          sx={{
            cursor: "pointer",
            "&:hover": {
              color: "brown",
            },
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            textOverflow: "ellipsis",
          }}
          variant="h6"
          component="h2"
          fontWeight="bold"
          onClick={handleTitleClick}
        >
          {recipe.title}
        </Typography>
        <Grid
          container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1,
            flexWrap: "nowrap",
          }}
        >
          <Grid
            item
            sx={{
              display: "flex",
              alignItems: "center",
              flexBasis: "auto",
              flexShrink: 1,
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            <AccessTimeIcon />
            <Typography noWrap>{recipe.intendTime}</Typography>
          </Grid>
          <Grid
            item
            sx={{
              display: "flex",
              alignItems: "center",
              flexBasis: "auto",
              flexShrink: 1,
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            <Bolt />
            <Typography noWrap>{recipe.level}</Typography>
          </Grid>
          <Grid
            item
            sx={{
              display: "flex",
              alignItems: "center",
              flexBasis: "auto",
              flexShrink: 1,
              flexGrow: 1,
              minWidth: 0,
              cursor: "pointer",
            }}
            onClick={handleLikeClick}
          >
            {liked ? (
              <FavoriteIcon color="error" fontSize="medium" />
            ) : (
              <FavoriteBorder fontSize="medium" />
            )}
            <Typography noWrap>{likeCount}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
