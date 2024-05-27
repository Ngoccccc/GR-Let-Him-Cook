import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { Grid, Typography, Avatar, Button } from "@mui/material/";
import VideoPlayer from "../components/RecipeDetails/VideoPlayer";
import {
  AccessTime as AccessTimeIcon,
  FavoriteBorder,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import Ingredients from "../components/RecipeDetails/Ingredients";
import Steps from "../components/RecipeDetails/Steps";
import Comments from "../components/RecipeDetails/Comment/Comments";
import SameRecipe from "../components/RecipeDetails/SameRecipe";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import ServerErrorPage from "./ErrorPage/ServerErrorPage";
import PageNotFound from "./ErrorPage/PageNotFound";
import NotHavePost from "./ErrorPage/NotHavePost";
import Loading from "../components/Loading";

const RecipeDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isHavePost, setIsHavePost] = useState(true);
  const [loading, setLoading] = useState(true);

  const getPost = async () => {
    try {
      const { data } = await axios.get(`/api/v1/post/get-post/${params.id}`);
      setPost(data.post);
      setLikeCount(data.post.likeCount);
      console.log(data);
      setLoading(false);
    } catch (error) {
      setStatus(error.response.status);
      console.log(error);
      setLoading(false);
    }
  };

  const checkPostPrivate = async (courseId) => {
    try {
      const { data } = await axios.get(
        `/api/v1/course/check-user-have-course/${courseId}`
      );
      console.log(data);
      setIsHavePost(data.status);
    } catch (error) {
      setStatus(error.response.status);
      console.log(error);
    }
  };
  useEffect(() => {
    if (params?.id) getPost();
    if (post?.courseId) checkPostPrivate(post.courseId);
  }, [params?.id, post?.courseId]);

  const handleNavigateCategory = (category) => {
    navigate(`/category/${category}`);
  };

  const [liked, setLiked] = useState(false);
  const checkLiked = async (postId) => {
    try {
      console.log(postId);
      const { data } = await axios.get(`/api/v1/like/like-status/${postId}`);

      setLiked(data.liked);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (post?._id && auth?.token) checkLiked(post._id);
  }, [post?._id, auth?.token]);

  const handleLikeClick = async () => {
    try {
      if (auth?.token) {
        const url = liked
          ? `/api/v1/like/unlike-post/${post._id}`
          : `/api/v1/like/like-post/${post._id}`;

        const { data } = await axios.post(url);
        setLiked(data.liked);
        setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
      }
    } catch (error) {
      console.log(error);
    }
  };

  let errorPage = null;
  if (status == 404) {
    errorPage = <PageNotFound />;
  } else if (status == 500) {
    errorPage = <ServerErrorPage />;
  } else if (!isHavePost) {
    errorPage = <NotHavePost />;
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {errorPage || (
        <Layout title={`Chi tiết công thức: ${post && post.title}`}>
          {!post ? (
            <Loading />
          ) : (
            <Grid container justifyContent="center">
              <Grid container spacing={2} justifyContent="space-around">
                <Grid item xs={8}>
                  <Grid sx={{ mt: 7 }}>
                    {!post.video ? (
                      <img
                        src={post.mediaTitle}
                        alt={post.title}
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <VideoPlayer videoUrl={post.video} />
                    )}
                    <Grid
                      sx={{
                        mt: 3,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="h4" component="h2" fontWeight="bold">
                        {post.title}
                      </Typography>
                      <Grid sx={{ display: "flex" }}>
                        <Typography variant="h5">Đã lưu {likeCount}</Typography>
                        <Grid
                          onClick={handleLikeClick}
                          sx={{ cursor: "pointer" }}
                        >
                          {liked ? (
                            <FavoriteIcon color="error" fontSize="large" />
                          ) : (
                            <FavoriteBorder fontSize="large" />
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid sx={{ my: 3, display: "flex", alignItems: "center" }}>
                      <Avatar
                        alt={post.userId.name}
                        src="/static/images/avatar/3.jpg"
                        sx={{ width: 60, height: 60 }}
                      />
                      <Typography
                        sx={{ pl: 3 }}
                        variant="h5"
                        component="h2"
                        fontWeight="bold"
                      >
                        {post.userId.name}
                      </Typography>
                    </Grid>
                    <Typography variant="h6">{post.description}</Typography>
                    <Ingredients
                      data={{
                        ingredients: post.ingredients,
                        ration: post.ration,
                      }}
                    />
                    <Steps steps={post.steps} />
                    <Grid borderBottom={1} borderColor="divider" sx={{ pb: 2 }}>
                      {post.categories.map((category, index) => (
                        <Button
                          key={index}
                          sx={{ mx: 1, color: "black" }}
                          variant="outlined"
                          onClick={() => handleNavigateCategory(category.slug)}
                        >
                          # {category.name}
                        </Button>
                      ))}
                    </Grid>
                    <Comments />
                  </Grid>
                </Grid>

                <Grid item xs={4}>
                  <SameRecipe
                    categories={post.categories}
                    currentPostId={post._id}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Layout>
      )}
    </>
  );
};

export default RecipeDetail;
