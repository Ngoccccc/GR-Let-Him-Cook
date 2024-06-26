import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import PageNotFound from "./pages/ErrorPage/PageNotFound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import PrivateRoute from "./components/Routes/Private";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Profile from "./pages/User/Profile";
import RecipeDetails from "./pages/RecipeDetails";
import Favorite from "./pages/User/Favorite";
import RecipeCategory from "./pages/RecipeCategory";
import Course from "./pages/Course";
import CourseDetails from "./pages/CourseDetails";
import SearchPage from "./pages/SearchPage";
// Admin
import AdminRoute from "./components/Routes/Admin";
import AdminCategory from "./pages/Admin/AdminCategory";
import AdminIngredients from "./pages/Admin/AdminIngredients";
import AdminPosts from "./pages/Admin/AdminPosts";
import AdminRecipeDetail from "./pages/Admin/AdminRecipeDetail";
import AdminCreatePost from "./pages/Admin/AdminCreatePost";
import AdminUpdatePost from "./pages/Admin/AdminUpdatePost";
import AdminPostApproval from "./pages/Admin/AdminPostApproval";
import AdminCourseApproval from "./pages/Admin/AdminCourseApproval";
import CourseDetail from "./pages/Admin/CourseDetail";
import AdminUser from "./pages/Admin/AdminUser";
import ChefRoute from "./components/Routes/Chef";
import ChefPosts from "./pages/Chef/ChefPosts";
import ChefCourses from "./pages/Chef/ChefCourses";
import ChefCreatePost from "./pages/Chef/ChefCreatePost";
import ChefUpdatePost from "./pages/Chef/ChefUpdatePost";
import ChefRecipeDetail from "./pages/Chef/ChefRecipeDetail";
import ChefCreateCourse from "./pages/Chef/ChefCreateCourse";
import ChefCourseDetail from "./pages/Chef/ChefCourseDetail";
import ChefCreatePostForCourse from "./pages/Chef/ChefCreatePostForCourse";
import ChefUpdateCourse from "./pages/Chef/ChefUpdateCourse";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/recipe-detail/:id" element={<RecipeDetails />} />
        <Route path="/category/:slug" element={<RecipeCategory />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="favorite" element={<Favorite />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/course-detail/:id" element={<CourseDetails />} />
        <Route path="/course/*" element={<Course />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />

        <Route path="/admin" element={<AdminRoute />}>
          <Route path="category" element={<AdminCategory />} />
          <Route path="ingredients" element={<AdminIngredients />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="create-post" element={<AdminCreatePost />} />
          <Route path="update-post/:id" element={<AdminUpdatePost />} />
          <Route path="recipe-detail/:id" element={<AdminRecipeDetail />} />
          <Route path="post-approval" element={<AdminPostApproval />} />
          <Route path="course-approval" element={<AdminCourseApproval />} />\
          <Route path="course-detail/:id" element={<CourseDetail />} />
          <Route path="users" element={<AdminUser />} />
        </Route>

        <Route path="/chef" element={<ChefRoute />}>
          <Route path="posts" element={<ChefPosts />} />
          <Route path="create-post" element={<ChefCreatePost />} />
          <Route path="update-post/:id" element={<ChefUpdatePost />} />
          <Route path="courses" element={<ChefCourses />} />
          <Route path="recipe-detail/:id" element={<ChefRecipeDetail />} />
          <Route path="create-course" element={<ChefCreateCourse />} />
          <Route path="update-course/:id" element={<ChefUpdateCourse />} />
          <Route path="course-detail/:id" element={<ChefCourseDetail />} />
          <Route
            path="create-post-for-course/:id"
            element={<ChefCreatePostForCourse />}
          />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
