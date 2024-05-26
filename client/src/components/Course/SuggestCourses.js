import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import CourseList from "./CourseList";
import Loading from "../Loading";

const SuggestCourses = () => {
  const [courses, setCourses] = useState([]);
  const [auth] = useAuth(); // Lấy thông tin đăng nhập
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const endpoint = auth?.token
          ? "/api/v1/course/get-unregistered-courses"
          : "/api/v1/course/get-courses";
        const response = await axios.get(endpoint);
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [auth]);
  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <CourseList courses={courses} suggestPage={true} />
    </div>
  );
};

export default SuggestCourses;
