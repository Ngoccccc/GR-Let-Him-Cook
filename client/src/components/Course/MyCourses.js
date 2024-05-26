import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import CourseList from "./CourseList";
import Loading from "../Loading";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [auth] = useAuth(); // Lấy thông tin đăng nhập
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/v1/course/get-user-courses");
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      } finally {
      }
    };

    if (auth?.token) fetchCourses();
  }, [auth?.token]);

  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <CourseList courses={courses} suggestPage={false} />
    </div>
  );
};

export default MyCourses;
