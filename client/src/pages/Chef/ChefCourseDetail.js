import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { AttachMoney, Description } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import axios from "axios";
import ServerErrorPage from "../PostAndCourseManager/ErrorPage/ServerErrorPage";
import PageNotFound from "../PostAndCourseManager/ErrorPage/PageNotFound";
import Loading from "../../components/Loading";
import PostCard from "../../components/Admin/PostCard";
import { red, grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import apiURL from "../../instances/axiosConfig";
const ChefCourseDetail = () => {
  const params = useParams();
  const [courseInfo, setCourseInfo] = useState({});
  const [postsOfCourse, setPostsOfCourse] = useState([]);
  const [status, setStatus] = useState(null);
  const [open, setOpen] = useState(false);
  const [userRegisteredQuantity, setUserRegisteredQuantity] = useState(0);
  const navigate = useNavigate();
  const getCourse = async () => {
    try {
      const { data } = await axios.get(
        `${apiURL}/api/v1/course/get-course-detail/${params.id}`
      );
      setCourseInfo(data.data.courseInfo);
      setPostsOfCourse(data.data.posts);
      setUserRegisteredQuantity(data.data.userRegisteredQuantity);
      console.log(data);
    } catch (error) {
      setStatus(error.response.status);
      console.log(error);
    }
  };

  useEffect(() => {
    if (params?.id) getCourse();
  }, [params?.id]);
  const handleDeleteClose = () => {
    handleDelete();
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `${apiURL}/api/v1/course/delete-course/${params.id}`
      );
      navigate("/chef/courses");
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
                    <Typography component="h2" fontWeight="bold">
                      Số người đã đăng kí khóa học: {userRegisteredQuantity}
                    </Typography>
                  </Grid>
                  <Grid
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mr: 3 }}
                      onClick={() =>
                        navigate(`/chef/update-course/${params.id}`)
                      }
                    >
                      Sửa
                    </Button>
                    <Button
                      onClick={() => setOpen(true)}
                      variant="contained"
                      color="error"
                    >
                      Xóa
                    </Button>
                  </Grid>
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
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography variant="h5" component="h2" fontWeight="bold">
                Danh sách bài học:{" "}
                {postsOfCourse ? postsOfCourse.length : 0 + " "} bài
              </Typography>
              <Button
                variant="contained"
                onClick={() =>
                  navigate(`/chef/create-post-for-course/${params.id}`)
                }
              >
                Thêm bài học
              </Button>
            </Grid>
            {!postsOfCourse ? (
              <Loading />
            ) : (
              <Grid sx={{ mb: 14, display: "flex" }} container spacing={2}>
                {postsOfCourse.map((recipe) => (
                  <Grid key={recipe._id} item xs={3}>
                    <PostCard recipe={recipe} role="chef" />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
          <Dialog open={open}>
            <DialogTitle id="alert-dialog-title" sx={{ margin: "auto" }}>
              <CancelIcon sx={{ color: red[500], fontSize: 80 }} />
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Bạn có chắc chắn muốn xóa khóa học này không
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button sx={{ color: grey[900] }} onClick={handleClose}>
                Bỏ qua
              </Button>
              <Button
                sx={{ color: red[500] }}
                onClick={handleDeleteClose}
                autoFocus
              >
                Xóa
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default ChefCourseDetail;
