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
import AdminRecipeDetails from "./pages/Admin/RecipeDetail";

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
          <Route path="recipe-detail/:id" element={<AdminRecipeDetails />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
