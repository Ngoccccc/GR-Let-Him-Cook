import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import {
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Box,
  CardMedia,
  Avatar,
  Button,
} from "@mui/material/";
import { AttachMoney, Description, ListAlt } from "@mui/icons-material";

import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import SinglePageRecipeCard from "../components/Card/SinglePageRecipeCard";
import Loading from "../components/Loading";

const SearchPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [courses, setCourses] = useState([]);
  const [searchParams] = useSearchParams();
  const getSearchResult = async () => {
    try {
      const searchTerm = searchParams.get("search") || "";
      const { data } = await axios.get(
        `/api/v1/search/search-global?search=${searchTerm}`
      );
      console.log(data);
      setPosts(data.suggestPosts);
      setCategories(data.suggestCategories);
      setCourses(data.suggestCourses);
      setIsLoading(false);
      console.log(data);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleNavigateDetail = (course) => {
    navigate(`/course-detail/${course}`);
  };
  useEffect(() => {
    if (searchParams) getSearchResult();
  }, [searchParams]);
  return (
    <Layout title={`Tìm kiếm: ${searchParams.get("search")}`}>
      {isLoading ? (
        <Loading />
      ) : (
        <Grid
          container
          sx={{
            width: "100%",
          }}
        >
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Kết quả tìm kiếm cho từ khóa : {searchParams.get("search")}
            </Typography>
          </Grid>
          {categories && categories?.length > 0 && (
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                pb: 1,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Danh mục:
              </Typography>
              {categories.map((category) => (
                <Button variant="text" size="large" sx={{ color: grey[900] }}>
                  # {category.name}
                </Button>
              ))}
            </Grid>
          )}
          {courses && (
            <Grid sx={{ width: "100%" }}>
              <Typography
                variant="h5"
                gutterBottom
                fontWeight="bold"
                sx={{ borderTop: 1, borderColor: "divider", py: 2, mt: 3 }}
              >
                Khóa học ({courses.length} kết quả)
              </Typography>
              <Grid container spacing={2}>
                {courses.map((course) => (
                  <Grid key={course._id} sx={{ px: 3 }} item xs={3}>
                    <Card
                      sx={{
                        width: "100%",
                        cursor: "pointer",
                        "&:hover": {
                          color: "brown",
                        },
                      }}
                      onClick={() => handleNavigateDetail(course._id)}
                    >
                      <CardMedia
                        component="img"
                        image={course.image}
                        alt={course.name}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "200px",
                        }}
                      />
                      <CardContent>
                        <Typography
                          variant="h6"
                          component="h2"
                          fontWeight="bold"
                        >
                          {course.name}
                        </Typography>
                        <Grid sx={{ display: "flex", alignItems: "center" }}>
                          <Description />
                          <Typography
                            sx={{
                              ml: 1,
                              display: "-webkit-box",
                              overflow: "hidden",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 1,
                              textOverflow: "ellipsis",
                            }}
                          >
                            {course.description}
                          </Typography>
                        </Grid>

                        <Grid sx={{ display: "flex", alignItems: "center" }}>
                          <AttachMoney />
                          <Typography
                            sx={{ my: 1, ml: 1 }}
                            component="p"
                            fontWeight="bold"
                          >
                            Giá: {course.price}.000 VND
                          </Typography>
                        </Grid>

                        <Grid
                          sx={{ my: 1, display: "flex", alignItems: "center" }}
                        >
                          <Avatar
                            alt={course.userId.name}
                            src="/static/images/avatar/3.jpg"
                            sx={{ width: 35, height: 35 }}
                          />
                          <Typography
                            sx={{ pl: 3 }}
                            variant="h6"
                            component="h2"
                            fontWeight="bold"
                          >
                            {course.userId.name}
                          </Typography>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
          {posts && (
            <Grid sx={{ width: "100%" }}>
              <Typography
                variant="h5"
                gutterBottom
                fontWeight="bold"
                sx={{ borderTop: 1, borderColor: "divider", py: 2, mt: 3 }}
              >
                Bài hướng dẫn ({posts.length} kết quả)
              </Typography>
              <Grid sx={{ display: "flex" }} container spacing={2}>
                {posts.map((recipe) => (
                  <Grid key={recipe._id} item xs={3}>
                    <SinglePageRecipeCard recipe={recipe} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
          {(!posts && !categories && !courses) ||
            (categories?.length == 0 &&
              courses?.length == 0 &&
              posts?.length == 0 && (
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    display: "flex",

                    width: "100%",
                  }}
                >
                  <ListAlt sx={{ fontSize: 300 }} color="primary" />
                  <Typography variant="h5" sx={{ display: "flex" }}>
                    Không tìm thấy kết quả cho
                    <Typography variant="h5" fontWeight="bold" sx={{ ml: 1 }}>
                      "{searchParams.get("search")}"
                    </Typography>
                  </Typography>
                </Grid>
              ))}
        </Grid>
      )}
    </Layout>
  );
};

export default SearchPage;
