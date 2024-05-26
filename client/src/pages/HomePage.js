import React from "react";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { Grid } from "@mui/material/";
import BannerSlide from "../components/HomePage/BannerSlide";
import NewRecipe from "./../components/HomePage/NewRecipe";
import GoodRecipe from "../components/HomePage/GoodRecipe";
import CategoryList from "../components/HomePage/CategoryList";
import FavoriteRecipe from "../components/HomePage/FavoriteRecipe";
import Course from "../components/HomePage/Course";
const HomePage = () => {
  return (
    <Layout title={"Trang chủ"}>
      <Grid container justifyContent="center">
        <BannerSlide />
        <Grid
          container
          spacing={2}
          justifyContent="space-around"
          sx={{ mt: 3 }}
        >
          <Grid item xs={8}>
            <NewRecipe />
            <GoodRecipe />
          </Grid>
          <Grid item xs={4}>
            <CategoryList />
            <FavoriteRecipe />
          </Grid>
        </Grid>
        <Course />
      </Grid>
    </Layout>
  );
};

export default HomePage;
