import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
} from "@mui/material/";
import { AttachMoney, Description } from "@mui/icons-material";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [auth] = useAuth(); // Lấy thông tin đăng nhập
  const navigate = useNavigate();

  const handleNavigateDetail = (course) => {
    navigate(`/course-detail/${course}`);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const endpoint = auth?.token
          ? "/api/v1/course/get-unregistered-courses"
          : "/api/v1/course/get-courses";
        const response = await axios.get(endpoint);
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [auth]);

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
  };

  return (
    <>
      {courses?.length > 0 ? (
        <Grid sx={{ mt: 3, width: "100%" }}>
          <Typography
            sx={{ mb: 3 }}
            variant="h5"
            component="h2"
            fontWeight="bold"
            borderBottom={1}
            borderColor="divider"
          >
            Khóa học nấu ăn
          </Typography>
          <Slider {...settings}>
            {courses.map((course) => (
              <Grid key={course._id} sx={{ px: 3 }}>
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
                    <Typography variant="h6" component="h2" fontWeight="bold">
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
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Slider>
        </Grid>
      ) : (
        <Typography variant="h6" component="p" sx={{ mt: 3 }}>
          Không có khóa học nào để hiển thị.
        </Typography>
      )}
    </>
  );
};

export default Course;
