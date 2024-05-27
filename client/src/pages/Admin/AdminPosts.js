import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "antd";
import { Button, Grid, Typography, TextField } from "@mui/material/";
import PostCard from "../../components/Admin/PostCard";
import Loading from "../../components/Loading";
import removeVietnameseTones from "../../utils/removeVietnameseTones";
function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  React.useLayoutEffect(() => {
    const fetchCategories = async () => {
      const data = await axios.get("/api/v1/post/get-posts");
      setPosts(data.data.posts);
      console.log(data.data.posts);
    };
    fetchCategories();
  }, []);

  const handleCreateCategory = () => {};

  // const handleDeleteCategory = async (category) => {
  //   try {
  //     await Modal.confirm({
  //       title: "Xác nhận xóa",
  //       content: `Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`,
  //       onOk: async () => {
  //         await axios.delete(
  //           `/api/v1/category/delete-category/${category.categoryId}`
  //         );
  //         setCategories(
  //           categories.filter((c) => c.categoryId !== category.categoryId)
  //         );
  //       },
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const lowercasedSearchTerm = removeVietnameseTones(
      searchTerm.toLowerCase()
    );
    const filtered = posts.filter((post) => {
      const titleMatch = removeVietnameseTones(
        post.title.toLowerCase()
      ).includes(lowercasedSearchTerm);
      const courseMatch =
        post.courseId &&
        removeVietnameseTones(post.courseId.name.toLowerCase()).includes(
          lowercasedSearchTerm
        );
      const userMatch = removeVietnameseTones(
        post.userId.name.toLowerCase()
      ).includes(lowercasedSearchTerm);
      return titleMatch || courseMatch || userMatch;
    });
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);
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
            Danh sách bài viết:
            {posts ? posts.length : 0} công thức
          </Typography>
          <Button variant="contained">Thêm công thức</Button>
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
        {!posts ? (
          <Loading />
        ) : (
          <Grid sx={{ mb: 14, display: "flex" }} container spacing={2}>
            {filteredPosts.map((recipe) => (
              <Grid key={recipe._id} item xs={3}>
                <PostCard recipe={recipe} />
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default AdminPosts;
