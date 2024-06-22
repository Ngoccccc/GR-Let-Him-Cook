import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { AttachMoney, Description } from "@mui/icons-material";
import { CheckCircle } from "@mui/icons-material/";
import { useParams } from "react-router-dom";
import axios from "axios";
import ServerErrorPage from "./ErrorPage/ServerErrorPage";
import PageNotFound from "./ErrorPage/PageNotFound";
import Loading from "../../components/Loading";
import PostCard from "../../components/Admin/PostCard";
import { red, grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import apiURL from "../../instances/axiosConfig";
const CourseDetail = () => {
  const params = useParams();
  const [courseInfo, setCourseInfo] = useState({});
  const [postsOfCourse, setPostsOfCourse] = useState([]);
  const [status, setStatus] = useState(null);
  const [openApproval, setOpenApproval] = useState(false);
  const navigate = useNavigate();
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

  useEffect(() => {
    if (params?.id) getCourse();
  }, [params?.id]);
  const handleApprovalClose = () => {
    handleApproval();
    setOpenApproval(false);
  };

  const handleClose = () => {
    setOpenApproval(false);
  };
  const handleApproval = async () => {
    try {
      const { data } = await axios.put(
        `${apiURL}/api/v1/course/approve-course/${params.id}`
      );
      navigate("/admin/course-approval");
    } catch (err) {
      console.log(err);
    }
  };
  let errorPage = null;
  if (status == 404) {
    errorPage = <PageNotFound />;
  } else if (status == 500) {
    errorPage = <ServerErrorPage />;
  }

  return (
    <>
      {errorPage || (
        <>
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
                  {courseInfo.status === "waiting" && (
                    <Grid
                      sx={{
                        mt: 3,
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Button
                        onClick={() => setOpenApproval(true)}
                        variant="contained"
                        color="success"
                      >
                        Phê duyệt khóa học
                      </Button>
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
                    <PostCard recipe={recipe} role="admin" />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
          <Dialog open={openApproval}>
            <DialogTitle id="alert-dialog-title" sx={{ margin: "auto" }}>
              <CheckCircle color="primary" sx={{ fontSize: 80 }} />
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Bạn có chắc chắn muốn phê duyệt bài hướng dẫn này không
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button sx={{ color: grey[900] }} onClick={handleClose}>
                Bỏ qua
              </Button>
              <Button onClick={handleApprovalClose} autoFocus>
                Phê duyệt
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default CourseDetail;
