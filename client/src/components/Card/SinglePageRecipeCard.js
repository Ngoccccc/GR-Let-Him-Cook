import React, { useState, useEffect } from "react";
import {
  AccessTime as AccessTimeIcon,
  Bolt,
  FavoriteBorder,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material/";
import axios from "axios";
import Loading from "../Loading";
import apiURL from "../../instances/axiosConfig";

const SinglePageRecipeCard = ({ recipe, isPrivate }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(recipe.likeCount);
  const [auth, setAuth] = useAuth();
  const [loading, setLoading] = useState(auth?.token ? true : false);
  const checkLiked = async (postId) => {
    try {
      const { data } = await axios.get(
        `${apiURL}/api/v1/like/like-status/${postId}`
      );
      console.log(data.liked);
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

  const navigate = useNavigate();
  const handleTitleClick = () => {
    navigate(`/recipe-detail/${recipe._id}`);
  };

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
  if (loading) {
    return <Loading />;
  }
  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        borderRadius: 5,
        border: "1px solid black",
      }}
    >
      <CardMedia
        component="img"
        image={recipe.mediaTitle}
        alt={recipe.title}
        style={{
          objectFit: "cover",
          width: "95%",
          height: "200px",
          margin: "auto",
          paddingTop: "5px",
          borderRadius: "20px",
        }}
        sx={{
          ...(!isPrivate && {
            cursor: "pointer",
          }),
        }}
        onClick={isPrivate ? null : handleTitleClick}
      />
      <CardContent>
        <Typography
          variant="h6"
          component="h2"
          fontWeight="bold"
          sx={{
            ...(!isPrivate && {
              cursor: "pointer",
              "&:hover": {
                color: "brown",
              },
            }),
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            textOverflow: "ellipsis",
          }}
          onClick={isPrivate ? null : handleTitleClick}
        >
          {recipe.title}
        </Typography>
        <Grid sx={{ display: "flex", mt: 1, alignItems: "center" }}>
          <Grid container direction="row">
            <AccessTimeIcon />
            <Typography>{recipe.intendTime}</Typography>
          </Grid>
          <Grid container direction="row">
            <Bolt />
            <Typography>{recipe.level}</Typography>
          </Grid>
          <Grid
            container
            direction="row"
            onClick={isPrivate ? null : handleLikeClick}
            sx={{ cursor: "pointer" }}
          >
            {liked ? (
              <FavoriteIcon color="error" fontSize="large" />
            ) : (
              <FavoriteBorder fontSize="large" />
            )}
            <Typography variant="h6">{likeCount}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SinglePageRecipeCard;
