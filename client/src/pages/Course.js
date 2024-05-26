import React, { useState } from "react";
import Layout from "./../components/Layout/Layout";
import { Box, Tab } from "@mui/material/";
import { TabContext, TabList, TabPanel } from "@mui/lab/";
import SuggestCourses from "../components/Course/SuggestCourses";
import MyCourses from "../components/Course/MyCourses";
import { useAuth } from "../context/auth";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

const CourseTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [auth] = useAuth();

  // Determine the current tab value based on the URL path
  const currentTab = location.pathname === "/course/my-course" ? "2" : "1";

  const handleChange = (event, newValue) => {
    // Update the route based on the selected tab
    if (newValue === "2") {
      navigate("/course/my-course");
    } else {
      navigate("/course");
    }
  };

  return (
    <TabContext value={currentTab}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleChange} aria-label="course tabs">
          <Tab label="Khóa học nổi bật" value="1" />
          {auth?.token && <Tab label="Khóa học của tôi" value="2" />}
        </TabList>
      </Box>
      <TabPanel value="1">
        <SuggestCourses />
      </TabPanel>
      <TabPanel value="2">
        <MyCourses />
      </TabPanel>
    </TabContext>
  );
};

const Course = () => {
  return (
    <Layout title={"Trang chủ"}>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <Routes>
          <Route path="/my-course" element={<CourseTabs />} />
          <Route path="/" element={<CourseTabs />} />
        </Routes>
      </Box>
    </Layout>
  );
};

export default Course;
