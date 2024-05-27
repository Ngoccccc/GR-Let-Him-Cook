import React, { useState, useEffect } from "react";
import { Grid, Typography, CardMedia } from "@mui/material/";
import { FavoriteBorder, Favorite as FavoriteIcon } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import Loading from "../Loading";

const SameRecipeCard = ({ recipe }) => {
  const [liked, setLiked] = useState(false);
  const [auth, setAuth] = useAuth();
  const [loading, setLoading] = useState(auth?.token ? true : false);

  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(recipe.likeCount);

  const handleTitleClick = () => {
    navigate(`/recipe-detail/${recipe._id}`);
  };

  const checkLiked = async (postId) => {
    try {
      const { data } = await axios.get(`/api/v1/like/like-status/${postId}`);
      setLiked(data.liked);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (recipe._id && auth?.token) checkLiked(recipe._id);
  }, []);

  const handleLikeClick = async () => {
    try {
      if (auth?.token) {
        const url = liked
          ? `/api/v1/like/unlike-post/${recipe._id}`
          : `/api/v1/like/like-post/${recipe._id}`;

        const { data } = await axios.post(url);
        setLiked(data.liked);
        setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <Grid>
      <CardMedia
        component="img"
        image={recipe.mediaTitle}
        alt={recipe.title}
        style={{
          objectFit: "cover",
          width: "100%",
        }}
        sx={{
          cursor: "pointer",
        }}
        onClick={handleTitleClick}
      />
      <Grid
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
        }}
      >
        <Typography
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
          onClick={handleTitleClick}
          variant="h6"
          component="h2"
          fontWeight="bold"
        >
          {recipe.title}
        </Typography>
        <Grid
          onClick={handleLikeClick}
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          {liked ? <FavoriteIcon color="error" /> : <FavoriteBorder />}
          <Typography>{likeCount}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SameRecipeCard;
