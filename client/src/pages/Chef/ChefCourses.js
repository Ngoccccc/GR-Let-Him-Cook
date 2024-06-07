import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Grid, Typography, TextField } from "@mui/material/";
import Loading from "../../components/Loading";
import removeVietnameseTones from "../../utils/removeVietnameseTones";
import CourseCard from "../../components/Admin/CourseCard";
import { useNavigate } from "react-router-dom";
import apiURL from "../../instances/axiosConfig";

function ChefCourses() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const navigate = useNavigate();

  React.useLayoutEffect(() => {
    const fetchCourses = async () => {
      const data = await axios.get(`${apiURL}/api/v1/course/get-my-courses`);
      setCourses(data.data.courses);
      console.log(data.data);
    };
    fetchCourses();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const lowercasedSearchTerm = removeVietnameseTones(
      searchTerm.toLowerCase()
    );
    const filtered = courses.filter((course) => {
      const nameMatch = removeVietnameseTones(
        course.name.toLowerCase()
      ).includes(lowercasedSearchTerm);
      const descriptionMatch =
        course.description &&
        removeVietnameseTones(course.description.toLowerCase()).includes(
          lowercasedSearchTerm
        );
      const userMatch = removeVietnameseTones(
        course.userId.name.toLowerCase()
      ).includes(lowercasedSearchTerm);
      return nameMatch || descriptionMatch || userMatch;
    });
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);
  return (
    <div>
      <Grid container justifyContent="center" alignItems="center">
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h5" component="h2" fontWeight="bold">
            Danh sách khoá học đã đăng:
            {courses ? courses.length : 0} khóa học
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/chef/create-course")}
          >
            Thêm khóa học
          </Button>
        </Grid>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
          />
        </Grid>
        {!courses ? (
          <Loading />
        ) : (
          <Grid sx={{ mb: 14, display: "flex" }} container spacing={2}>
            {filteredCourses.map((course) => (
              <Grid key={course._id} item xs={3}>
                <CourseCard course={course} role="chef" />
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default ChefCourses;
