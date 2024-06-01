import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material/";
import { ArrowForwardIos } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const getCategories = async () => {
    try {
      const { data } = await axios.get(`/api/v1/category/get-all-category`);
      setCategories(data.categories);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  const navigate = useNavigate();
  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };
  return (
    <>
      {!categories ? (
        <Loading />
      ) : (
        <Grid>
          <Typography
            variant="h5"
            component="h2"
            fontWeight="bold"
            borderBottom={1}
            borderColor="divider"
          >
            Danh mục
          </Typography>
          {categories.map((category, index) => (
            <Grid
              sx={{ display: "flex", py: 2, justifyContent: "space-between" }}
              fontWeight="bold"
              borderBottom={1}
              borderColor="divider"
              key={index}
            >
              <Grid sx={{ display: "flex" }}>
                <ArrowForwardIos />
                <Typography
                  component="h2"
                  fontWeight="bold"
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      color: "blue",
                    },
                  }}
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  {category.name}
                </Typography>
              </Grid>
              <Typography>({category.postCount})</Typography>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default CategoryList;
