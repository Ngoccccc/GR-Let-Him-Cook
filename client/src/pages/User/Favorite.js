import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { Grid, Typography } from "@mui/material/";
import SinglePageRecipeCard from "../../components/Card/SinglePageRecipeCard";
import axios from "axios";
import Loading from "../../components/Loading";
import apiURL from "../../instances/axiosConfig";

const Favorite = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const getPosts = async () => {
    try {
      const { data } = await axios.get(`${apiURL}/api/v1/like/get-liked-posts`);
      setLikedPosts(data.likedPosts);
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);
  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }
  console.log(likedPosts);
  return (
    <Layout title={"Công thức yêu thích"}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h5" component="h2" fontWeight="bold">
            Công thức yêu thích: {likedPosts ? likedPosts.length : 0} công thức
          </Typography>
        </Grid>
        {!likedPosts ? (
          <Loading />
        ) : (
          <Grid sx={{ mb: 14, display: "flex" }} container spacing={2}>
            {likedPosts.map((recipe) => (
              <Grid key={recipe._id} item xs={3}>
                <SinglePageRecipeCard recipe={recipe.postId} />
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

export default Favorite;
