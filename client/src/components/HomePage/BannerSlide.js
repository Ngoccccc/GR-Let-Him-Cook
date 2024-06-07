import React, { useState, useEffect } from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { Grid, Typography } from "@mui/material/";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";

const BannerSlide = () => {
  const navigate = useNavigate();
  const handleTitleClick = (recipe) => {
    navigate(`/recipe-detail/${recipe}`);
  };
  const titleStyle = {
    padding: "10px 20px",
    background: "rgba(0, 0, 0, 0.5)",
    color: "#ffffff",
    backdropFilter: "blur(5px)",
    borderRadius: "5px",
    zIndex: 2,
  };

  const divStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "350px",
    width: "100%",
    borderRadius: "30px",
  };

  const [newPosts, setNewPosts] = useState([]);
  const getNewPosts = async () => {
    try {
      const { data } = await axios.get(`/api/v1/post/get-post-by-time`);
      setNewPosts(data.postOfCategory);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getNewPosts();
  }, []);
  return (
    <Grid item xs={8}>
      {newPosts?.length == 0 ? (
        <Loading />
      ) : (
        <Slide>
          {newPosts?.map((recipe, index) => (
            <Grid
              sx={{ cursor: "pointer" }}
              key={index}
              onClick={() => handleTitleClick(recipe.postId._id)}
            >
              <div
                style={{
                  ...divStyle,
                  backgroundImage: `url(${recipe.postId.mediaTitle})`,
                }}
              >
                <div style={titleStyle}>
                  <Typography variant="h6">{recipe.postId.title}</Typography>
                </div>
              </div>
            </Grid>
          ))}
        </Slide>
      )}
    </Grid>
  );
};

export default BannerSlide;
