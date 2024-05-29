import React from "react";

import { useNavigate } from "react-router-dom";
import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material/";

const PostCard = ({ recipe }) => {
  const navigate = useNavigate();
  const handleTitleClick = () => {
    navigate(`/admin/recipe-detail/${recipe._id}`);
  };

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
          cursor: "pointer",
        }}
        onClick={handleTitleClick}
      />
      <CardContent
        sx={{
          cursor: "pointer",
          "&:hover": {
            color: "brown",
          },
        }}
        onClick={handleTitleClick}
      >
        <Typography
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            textOverflow: "ellipsis",
          }}
          variant="h6"
          component="h2"
          fontWeight="bold"
        >
          {recipe.title}
        </Typography>
        <Typography
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            textOverflow: "ellipsis",
          }}
        >
          Thuộc khóa học: {recipe.courseId ? recipe.courseId.name : "Không có"}
        </Typography>
        <Typography>
          Người đăng: <b>{recipe.userId.name}</b>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PostCard;
