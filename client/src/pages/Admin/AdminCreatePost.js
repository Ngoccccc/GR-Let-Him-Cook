import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Paper,
  Typography,
  Grid,
  IconButton,
  Autocomplete,
} from "@mui/material";
import MultiSelect from "../../components/MultiSelect";
import { Add, Delete, CloudUpload, Clear } from "@mui/icons-material";
import axios from "axios";
import app from "../../firebase";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { Image } from "antd";
import { v4 as uuidv4 } from "uuid";
export default function AdminCreatePost() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const storage = getStorage(app);
  const uniqueId = uuidv4();
  console.log(uniqueId);
  const handleSelectionChange = (newSelectedCategories) => {
    setSelectedCategories(newSelectedCategories);
  };

  const getSelectedCategoryIds = () => {
    return selectedCategories.map((category) => category._id);
  };

  const [title, setTitle] = useState("");
  const [mediaTitle, setMediaTitle] = useState(null);
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState("");
  const [ration, setRation] = useState("");
  const [level, setLevel] = useState("");
  const [intendTime, setIntendTime] = useState("");
  const [steps, setSteps] = useState([{ description: "", imageUrls: [] }]);
  const [ingredients, setIngredients] = useState([
    { _id: "", name: "", quantity: 1, unit: "", key: Date.now() },
  ]);
  const [categories, setCategories] = useState([]);
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [formValidIngredient, setFormValidIngredient] = useState(true);
  const [formValidSteps, setFormValidSteps] = useState(true);
  useEffect(() => {
    const fetchIngredients = async () => {
      const { data } = await axios.get("/api/v1/ingredient/get-ingredient");
      setIngredientOptions(data.ingredient);
    };

    const fetchCategories = async () => {
      const { data } = await axios.get(
        "/api/v1/category/get-all-category-admin"
      );
      setCategoryOptions(data.categories);
    };

    fetchIngredients();
    fetchCategories();
  }, []);

  const handleUpload = async (file, filename) => {
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    validateFormIngredient();
    validateFormSteps();
    if (!formValidIngredient || !formValidSteps) {
      alert(
        "Hãy hoàn thiện các form và check lại giá trị số lượng phải là số dương"
      );
      return;
    }
    setLoading(true);
    const stepsWithUrls = await Promise.all(
      steps.map(async (step, index) => {
        const imageUrls = await Promise.all(
          step.imageUrls.map(
            async (file, i) =>
              await handleUpload(
                file,
                `images/post/${uniqueId}/step${index + 1}/${i}`
              )
          )
        );
        return { ...step, imageUrls, order: index + 1 };
      })
    );

    const imageUrl = await handleUpload(
      mediaTitle,
      `images/post/${uniqueId}/mediaTitle`
    );
    const videoUrl = video
      ? await handleUpload(video, `video/post/${uniqueId}`)
      : null;

    const postData = {
      title,
      mediaTitle: imageUrl,
      video: videoUrl,
      description,
      ration,
      level,
      status: "published",
      intendTime,
      steps: stepsWithUrls,
      ingredients: ingredients.map((ingredient) => ({
        id: ingredient._id,
        quantity: ingredient.quantity,
      })),
      categories: getSelectedCategoryIds(),
    };
    try {
      const postSave = await axios.post("/api/v1/post/create-post", postData);
      console.log("Post Data: ", postSave);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);

    // Submit postData to your backend here
  };

  const addStep = () =>
    setSteps([...steps, { description: "", imageUrls: [] }]);
  const addIngredient = () =>
    setIngredients([
      ...ingredients,
      { _id: "", name: "", quantity: 1, unit: "", key: Date.now() },
    ]);

  const handleStepImageChange = (index, files) => {
    const newSteps = [...steps];
    newSteps[index].imageUrls = [
      ...newSteps[index].imageUrls,
      ...Array.from(files),
    ];
    setSteps(newSteps);
  };

  const handleRemoveImage = (stepIndex, imageIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].imageUrls.splice(imageIndex, 1);
    setSteps(newSteps);
  };

  const handleChangeStepDescription = (index, value) => {
    const newSteps = [...steps];
    newSteps[index].description = value;
    setSteps(newSteps);
    validateFormSteps();
  };

  const handleRemoveStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
    validateFormSteps();
  };

  const handleChangeIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;

    if (field === "_id") {
      const selectedIngredient = ingredientOptions.find(
        (option) => option._id === value
      );

      // Nếu tìm thấy nguyên liệu được chọn, thay thế đối tượng nguyên liệu trong mảng
      if (selectedIngredient) {
        newIngredients[index] = { ...selectedIngredient };
      } else {
        // Nếu không tìm thấy nguyên liệu, gán một đối tượng mới với _id tương ứng vào mảng
        newIngredients[index] = { _id: value };
      }
    }

    setIngredients(newIngredients);
    console.log(newIngredients);
    validateFormIngredient();
  };

  const validateFormIngredient = () => {
    const isValid = ingredients.every(
      (ingredient) => ingredient._id && ingredient.quantity > 0
    );
    setFormValidIngredient(isValid);
  };

  const validateFormSteps = () => {
    const isValid = steps.every((step) => step.description.trim() !== "");
    setFormValidSteps(isValid);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
    validateFormIngredient();
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tạo bài hướng dẫn nấu ăn mới
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Tên món ăn"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
              onChange={(e) => setMediaTitle(e.target.files[0])}
            />
          </Button>
          {mediaTitle && (
            <Grid
              sx={{
                mt: 1,
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Image width={300} src={URL.createObjectURL(mediaTitle)} />
              <Button
                sx={{
                  minHeight: 0,
                  minWidth: 0,
                  padding: 0,
                  color: "black",
                }}
                onClick={() => setMediaTitle(null)}
              >
                <Clear />
              </Button>
            </Grid>
          )}
        </Grid>

        <Grid sx={{ my: 1 }}>
          <Typography variant="h6" gutter>
            Video hướng dẫn
          </Typography>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUpload />}
          >
            Tải video
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={(e) => setVideo(e.target.files[0])}
            />
          </Button>
          {video && (
            <Grid
              sx={{
                mt: 1,
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <video width="300" controls>
                <source src={URL.createObjectURL(video)} />
              </video>
              <Button
                sx={{
                  minHeight: 0,
                  minWidth: 0,
                  padding: 0,
                  color: "black",
                }}
                onClick={() => setVideo(null)}
              >
                <Clear />
              </Button>
            </Grid>
          )}
        </Grid>
        <TextField
          fullWidth
          margin="normal"
          label="Giới thiệu về món ăn"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Khẩu phần ăn</InputLabel>
          <Select
            label="Khẩu phần ăn"
            value={ration}
            onChange={(e) => setRation(e.target.value)}
          >
            <MenuItem value="1 người">1 người</MenuItem>
            <MenuItem value="2 người">2 người</MenuItem>
            <MenuItem value="3 người">3 người</MenuItem>
            <MenuItem value="4 người">4 người</MenuItem>
            <MenuItem value="5 người">5 người</MenuItem>
            <MenuItem value="6 người">6 người</MenuItem>
            <MenuItem value="7 người">7 người</MenuItem>
            <MenuItem value="8 người">8 người</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Độ khó</InputLabel>
          <Select
            label="Độ khó"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <MenuItem value="Dễ">Dễ</MenuItem>
            <MenuItem value="Trung bình">Trung bình</MenuItem>
            <MenuItem value="Khó">Khó</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Thời gian thực hiện</InputLabel>
          <Select
            label="Thời gian thực hiện"
            value={intendTime}
            onChange={(e) => setIntendTime(e.target.value)}
          >
            <MenuItem value="15 phút">15 phút</MenuItem>
            <MenuItem value="30 phút">30 phút</MenuItem>
            <MenuItem value="45 phút">45 phút</MenuItem>
            <MenuItem value="1 giờ">1 giờ</MenuItem>
            <MenuItem value="1.5 giờ">1.5 giờ</MenuItem>
            <MenuItem value="2 giờ">2 giờ</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Nguyên liệu cần thiết</Typography>
          {ingredients.map((ingredient, index) => (
            <Grid
              fullWidth
              container
              spacing={2}
              key={ingredient.key}
              sx={{ mb: 2 }}
            >
              <Grid item xs={6}>
                <FormControl
                  fullWidth
                  margin="normal"
                  required
                  error={!ingredient.name}
                >
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={ingredientOptions.map((option) => option.name)}
                    value={ingredient.name}
                    onChange={(e, newValue) =>
                      handleChangeIngredient(
                        index,
                        "_id",
                        ingredientOptions.find(
                          (option) => option.name === newValue
                        )._id
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!ingredient.name}
                        helperText={
                          !ingredient.name && "Vui lòng chọn một nguyên liệu"
                        }
                        label={`Nguyên liệu ${index + 1}`}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Grid
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <TextField
                    margin="normal"
                    label="Số lượng"
                    type="number"
                    value={ingredient.quantity}
                    onChange={(e) =>
                      handleChangeIngredient(index, "quantity", e.target.value)
                    }
                    required
                    error={ingredient.quantity <= 0}
                    helperText={
                      ingredient.quantity <= 0 && "Số lượng cần lớn hơn 0"
                    }
                  />
                  <Typography sx={{ ml: 4 }}>{ingredient.unit}</Typography>
                </Grid>
                <Grid item sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={() => handleRemoveIngredient(index)}>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Grid sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={addIngredient}
            >
              Thêm nguyên liệu
            </Button>
          </Grid>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Các bước thực hiện</Typography>
          {steps.map((step, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Grid sx={{ display: "flex" }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label={`Bước ${index + 1}: Chi tiết thực hiện`}
                  multiline
                  rows={2}
                  value={step.description}
                  onChange={(e) =>
                    handleChangeStepDescription(index, e.target.value)
                  }
                  required
                  error={step.description.trim() === ""}
                  helperText={
                    step.description.trim() === "" &&
                    "Cần phải nhập chi tiết các thực hiện"
                  }
                />

                <IconButton onClick={() => handleRemoveStep(index)}>
                  <Delete />
                </IconButton>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sx={{ mt: 1 }}>
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
                      multiple
                      onChange={(e) =>
                        handleStepImageChange(index, e.target.files)
                      }
                    />
                  </Button>
                </Grid>
                {step.imageUrls.map((image, imgIndex) => (
                  <Grid
                    item
                    key={imgIndex}
                    sx={{ mt: 1, display: "flex", alignItems: "flex-start" }}
                  >
                    <Image
                      width={100}
                      src={URL.createObjectURL(image)}
                      alt={`Bước ${index + 1} Chi tiết ${imgIndex + 1}`}
                    />
                    <Button
                      sx={{
                        minHeight: 0,
                        minWidth: 0,
                        padding: 0,
                        color: "black",
                      }}
                      onClick={() => handleRemoveImage(index, imgIndex)}
                    >
                      <Clear />
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
          <Grid sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="outlined" startIcon={<Add />} onClick={addStep}>
              Thêm bước mới
            </Button>
          </Grid>
        </Box>

        <Box sx={{ my: 2 }}>
          <Typography variant="h6">Danh mục của món ăn</Typography>
          <Grid sx={{ my: 2 }}>
            <MultiSelect
              data={categoryOptions}
              onSelectionChange={handleSelectionChange}
            />
          </Grid>
        </Box>
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
}
