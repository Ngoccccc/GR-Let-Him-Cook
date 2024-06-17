import React from "react";
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
import { useNavigate } from "react-router-dom";
const CourseCard = ({ course, role }) => {
  const navigate = useNavigate();
  return (
    <Grid key={course._id} sx={{ px: 3 }}>
      <Card
        sx={{
          width: "100%",
          cursor: "pointer",
          "&:hover": {
            color: "brown",
          },
        }}
        onClick={() => navigate(`/${role}/course-detail/${course._id}`)}
      >
        <CardMedia
          component="img"
          image={course.image}
          alt={course.name}
          style={{
            objectFit: "cover",
            width: "200px",
            height: "100%",
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
            <Typography sx={{ my: 1, ml: 1 }} component="p" fontWeight="bold">
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
  );
};

export default CourseCard;
