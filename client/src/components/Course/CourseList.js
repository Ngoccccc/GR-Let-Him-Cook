import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Avatar,
} from "@mui/material";
import { useAuth } from "../../context/auth";
import {
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
} from "@mui/icons-material/";
import { useNavigate } from "react-router-dom";
import PaymentButton from "./PaymentButton";

const CourseList = ({ courses, suggestPage }) => {
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleNavigateDetail = (course) => {
    navigate(`/course-detail/${course}`);
  };
  useEffect(() => {
    setDisplayedCourses(courses.slice(0, 5));
  }, [courses]);
  const loadMoreCourses = () => {
    setPage((prev) => {
      const nextPage = prev + 1;
      const newDisplayedCourses = courses.slice(0, nextPage * 5);
      setDisplayedCourses(newDisplayedCourses);
      return nextPage; // Trả về giá trị mới của page
    });
  };

  const loadLessCourses = () => {
    setPage((prev) => {
      const prevPage = prev - 1;
      const newDisplayedCourses = courses.slice(0, prevPage * 5);
      setDisplayedCourses(newDisplayedCourses);
      return prevPage; // Trả về giá trị mới của page
    });
  };

  return (
    <Grid
      container
      spacing={3}
      sx={{ width: "100%", display: "flex", justifyContent: "center" }}
    >
      {displayedCourses.map((course) => (
        <Grid item xs={12} key={course._id}>
          <Card sx={{ display: "flex", alignItems: "flex-start", height: 200 }}>
            <CardMedia
              component="img"
              sx={{
                height: "100%",
                width: "300px",
                cursor: "pointer",
              }}
              image={course.image}
              alt={course.name}
              onClick={() => handleNavigateDetail(course._id)}
            />
            <Grid
              sx={{
                display: "flex",
                justifyContent: "space-between",
                objectFit: "cover",
                width: "100%",
                alignItems: "flex-start",
              }}
            >
              <CardContent>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="space-around"
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      color: "brown",
                    },
                  }}
                  onClick={() => handleNavigateDetail(course._id)}
                >
                  <Typography variant="h5" component="div">
                    {course.name}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      textOverflow: "ellipsis",
                    }}
                  >
                    {course.description}
                  </Typography>
                  <Typography sx={{ my: 1 }} component="p" fontWeight="bold">
                    Giá: {course.price}.000 VND
                  </Typography>
                  <Grid sx={{ my: 1, display: "flex", alignItems: "center" }}>
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
                </Grid>
              </CardContent>
            </Grid>
            {auth?.token && suggestPage && (
              <CardActions>
                <PaymentButton
                  courseId={course._id}
                  userId={auth?.user._id}
                  name={course.name}
                  amount={course.price}
                />
              </CardActions>
            )}
          </Card>
        </Grid>
      ))}
      <Grid>
        {displayedCourses.length < courses.length && (
          <Button
            variant="text"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
            onClick={loadMoreCourses}
          >
            <Grid>
              <Typography>Xem thêm khóa học</Typography>
              <KeyboardDoubleArrowDown />
            </Grid>
          </Button>
        )}
        {displayedCourses.length > 5 && (
          <Button
            variant="text"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
            onClick={loadLessCourses}
          >
            <Grid>
              <KeyboardDoubleArrowUp />
              <Typography>Ẩn bớt khóa học</Typography>
            </Grid>
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default CourseList;
