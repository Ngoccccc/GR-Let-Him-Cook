import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { Grid, Typography } from "@mui/material/";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SinglePageRecipeCard from "../components/Card/SinglePageRecipeCard";
import Loading from "../components/Loading";
const RecipeCategory = () => {
  const [postCategory, setPostCategory] = useState([]);
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const getPosts = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/post/get-post-by-category/${params.slug}`
      );
      setPostCategory(data.postOfCategory);
      setCategory(data.category);
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
    return <Loading />;
  }
  return (
    <Layout title={"Công thức đã lưu"}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h5" component="h2" fontWeight="bold">
            Công thức về {!category ? "" : category.name}:{" "}
            {postCategory ? postCategory.length : 0} công thức
          </Typography>
        </Grid>
        {!postCategory ? (
          <Loading />
        ) : (
          <Grid sx={{ mb: 14, display: "flex" }} container spacing={2}>
            {postCategory.map((recipe) => (
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

export default RecipeCategory;
