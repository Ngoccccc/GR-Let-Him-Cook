import React, { useState, useEffect } from "react";
import { Grid, Typography, Avatar, Button } from "@mui/material/";
import VideoPlayer from "../../components/RecipeDetails/VideoPlayer";
import Ingredients from "../../components/RecipeDetails/Ingredients";
import Steps from "../../components/RecipeDetails/Steps";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ServerErrorPage from "./ErrorPage/ServerErrorPage";
import PageNotFound from "./ErrorPage/PageNotFound";
import Loading from "../../components/Loading";

const RecipeDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPost = async () => {
    try {
      const { data } = await axios.get(`/api/v1/post/get-post/${params.id}`);
      setPost(data.post);
      console.log(data);
      setLoading(false);
    } catch (error) {
      setStatus(error.response.status);
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.id) getPost();
  }, [params?.id, post?.courseId]);

  let errorPage = null;
  if (status == 404) {
    errorPage = <PageNotFound />;
  } else if (status == 500) {
    errorPage = <ServerErrorPage />;
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {errorPage || (
        <>
          {!post ? (
            <Loading />
          ) : (
            <Grid container justifyContent="center">
              <Grid container spacing={2} justifyContent="space-around">
                <Grid item xs={8}>
                  <Grid>
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
                    <Grid sx={{ display: "flex", alignItems: "center" }}>
                      <Typography>Danh mục của hướng dẫn:</Typography>
                      <Grid>
                        {post.categories.map((category, index) => (
                          <Typography
                            key={index}
                            sx={{
                              mx: 1,
                              color: "black",
                              border: 1,
                              p: 1,
                              borderColor: "rgba(255,255,255,)",
                            }}
                            variant="outlined"
                          >
                            # {category.name}
                          </Typography>
                        ))}
                      </Grid>
                    </Grid>
                    <Grid
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-around",
                        mt: 5,
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          width: "30%",
                          p: 2,
                        }}
                        onClick={() =>
                          navigate(`/admin/update-post/${params.id}`)
                        }
                      >
                        Sửa công thức
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        sx={{
                          width: "30%",
                          p: 2,
                        }}
                      >
                        Xóa công thức
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </>
  );
};

export default RecipeDetail;
