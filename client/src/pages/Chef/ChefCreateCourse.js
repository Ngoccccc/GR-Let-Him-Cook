import React, { useState, useEffect } from "react";
import { Button, Box, Paper, Typography, Grid, TextField } from "@mui/material";
import axios from "axios";
import app from "../../firebase";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { CloudUpload, Clear } from "@mui/icons-material";
import { Image } from "antd";
import { useNavigate } from "react-router-dom";
import apiURL from "../../instances/axiosConfig";

const ChefCreateCourse = () => {
  const uniqueId = uuidv4();
  const navigate = useNavigate();
  const storage = getStorage(app);

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file, filename) => {
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (price <= 0) {
      return;
    }
    setLoading(true);
    const imageUrl = await handleUpload(
      image,
      `images/course/${uniqueId}/image`
    );

    const courseData = {
      name,
      image: imageUrl,
      description,
      price,
    };
    console.log(courseData);
    try {
      const course = await axios.post(
        `${apiURL}/api/v1/course/create-course`,
        courseData
      );
      console.log("Post Data: ", course);
      navigate(`/chef/course-detail/${course.data.course._id}`);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tạo bài khóa học nấu ăn mới
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Tên món ăn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Grid sx={{ my: 1 }}>
          <Typography variant="h6" gutter>
            Ảnh đại diện*
          </Typography>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUpload />}
          >
            Tải ảnh
            <input
              type="file"
              accept="image/*"
              hidden
              required
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Button>
          {image && (
            <Grid
              sx={{
                mt: 1,
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Image
                width={300}
                src={
                  image && typeof image === "string"
                    ? image
                    : URL.createObjectURL(image)
                }
              />
              <Button
                sx={{
                  minHeight: 0,
                  minWidth: 0,
                  padding: 0,
                  color: "black",
                }}
                onClick={() => setImage(null)}
              >
                <Clear />
              </Button>
            </Grid>
          )}
        </Grid>
        <TextField
          fullWidth
          margin="normal"
          label="Giới thiệu về khóa học"
          multiline
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Grid sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            sx={{ width: "15%", mr: 1 }}
            margin="normal"
            label="Giá của khóa học"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            error={price <= 0}
            helperText={price <= 0 && "Giá của khóa học cần lớn hơn 0"}
          />
          <Typography>.000 VND (Đơn vị nghìn Việt Nam Đồng)</Typography>
        </Grid>

        <Button
          variant="contained"
          type="submit"
          size="large"
          disabled={loading}
        >
          Đăng bài hướng dẫn
        </Button>
      </Box>
    </Paper>
  );
};

export default ChefCreateCourse;
