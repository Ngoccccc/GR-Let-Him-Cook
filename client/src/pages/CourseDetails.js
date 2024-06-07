import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { Grid, Typography, Avatar } from "@mui/material";
import { AttachMoney, Description } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import axios from "axios";
import ServerErrorPage from "./ErrorPage/ServerErrorPage";
import PageNotFound from "./ErrorPage/PageNotFound";
import SinglePageRecipeCard from "../components/Card/SinglePageRecipeCard";
import PaymentButton from "../components/Course/PaymentButton";
import { useAuth } from "../context/auth";
import Loading from "../components/Loading";
import apiURL from "../instances/axiosConfig";
const CourseDetails = () => {
  const params = useParams();
  const [courseInfo, setCourseInfo] = useState({});
  const [postsOfCourse, setPostsOfCourse] = useState([]);
  const [status, setStatus] = useState(null);
  const [isHaveCourse, setIsHaveCourse] = useState(true);
  const [auth] = useAuth();
  const getCourse = async () => {
    try {
      const { data } = await axios.get(
        `${apiURL}/api/v1/course/get-course-detail/${params.id}`
      );
      setCourseInfo(data.data.courseInfo);
      setPostsOfCourse(data.data.posts);
      console.log(data);
    } catch (error) {
      setStatus(error.response.status);
      console.log(error);
    }
  };

  const checkUserHaveCourse = async (courseId) => {
    try {
      const { data } = await axios.get(
        `${apiURL}/api/v1/course/check-user-have-course/${courseId}`
      );
      console.log(data);
      setIsHaveCourse(data.status);
    } catch (error) {
      setStatus(error.response.status);
      console.log(error);
    }
  };
  useEffect(() => {
    if (params?.id) getCourse();
    if (params?.id) checkUserHaveCourse(params?.id);
  }, [params?.id]);

  let errorPage = null;
  if (status == 404) {
    errorPage = <PageNotFound />;
  } else if (status == 500) {
    errorPage = <ServerErrorPage />;
  }

  return (
    <>
      {errorPage || (
        <Layout title={`Chi tiết khóa học: ${courseInfo && courseInfo.name}`}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{
              width: "100%",
            }}
          >
            <Typography variant="h5">Chi tiết khóa học:</Typography>
            {courseInfo && (
              <Grid
                sx={{
                  mt: 2,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={courseInfo.image}
                  alt={courseInfo.name}
                  style={{
                    width: "30%",
                    height: 300,
                    objectFit: "cover",
                  }}
                />
                <Grid sx={{ ml: 5 }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    fontWeight="bold"
                    sx={{ my: 1 }}
                  >
                    {courseInfo?.name}
                  </Typography>
                  <Grid sx={{ display: "flex", alignItems: "center", my: 1 }}>
                    <Description />
                    <Typography
                      sx={{
                        ml: 1,
                      }}
                    >
                      {courseInfo?.description}
                    </Typography>
                  </Grid>

                  <Grid sx={{ display: "flex", alignItems: "center" }}>
                    <AttachMoney />
                    <Typography
                      sx={{ my: 1, ml: 1 }}
                      component="p"
                      fontWeight="bold"
                    >
                      Giá: {courseInfo.price}.000 VND
                    </Typography>
                  </Grid>

                  <Grid sx={{ my: 1, display: "flex", alignItems: "center" }}>
                    <Avatar
                      alt={courseInfo?.userId?.name}
                      src="/static/images/avatar/3.jpg"
                      sx={{ width: 35, height: 35 }}
                    />
                    <Typography
                      sx={{ pl: 3 }}
                      variant="h6"
                      component="h2"
                      fontWeight="bold"
                    >
                      {courseInfo?.userId?.name}
                    </Typography>
                  </Grid>
                  {!isHaveCourse && (
                    <Grid
                      sx={{
                        mt: 3,
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      {auth?.user && (
                        <PaymentButton
                          courseId={courseInfo._id}
                          userId={auth?.user?._id}
                          name={courseInfo.name}
                          amount={courseInfo.price}
                        />
                      )}
                    </Grid>
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid
            sx={{ width: "100%", my: 3 }}
            borderBottom={1}
            borderColor="divider"
          ></Grid>
          <Grid container justifyContent="center" alignItems="center">
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography variant="h5" component="h2" fontWeight="bold">
                Danh sách bài học:{" "}
                {postsOfCourse ? postsOfCourse.length : 0 + " "} bài
              </Typography>
            </Grid>
            {!postsOfCourse ? (
              <Loading />
            ) : (
              <Grid sx={{ mb: 14, display: "flex" }} container spacing={2}>
                {postsOfCourse.map((recipe) => (
                  <Grid key={recipe._id} item xs={3}>
                    <SinglePageRecipeCard
                      recipe={recipe}
                      isPrivate={!isHaveCourse}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Layout>
      )}
    </>
  );
};

export default CourseDetails;
