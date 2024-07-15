import React, { useState, useEffect } from "react";
import { Button, Box, Paper, Typography } from "@mui/material";
import axios from "axios";
import app from "../../firebase";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import MediaTitleForm from "../../components/Admin/Form/MediaTitleForm";
import VideoForm from "../../components/Admin/Form/VideoForm";
import IngredientForm from "../../components/Admin/Form/IngredientForm";
import StepForm from "../../components/Admin/Form/StepForm";
import TitleForm from "../../components/Admin/Form/TitleForm";
import DescriptionForm from "../../components/Admin/Form/DescriptionForm";
import RationForm from "../../components/Admin/Form/RationForm";
import LevelForm from "../../components/Admin/Form/LevelForm";
import IntendTimeForm from "../../components/Admin/Form/IntendTimeForm";
import CategoryForm from "../../components/Admin/Form/CategoryForm";
import generateRandom from "../../utils/generateRandom";
import { useNavigate } from "react-router-dom";
import apiURL from "../../instances/axiosConfig";
export default function CreatePost({ courseId, role }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const storage = getStorage(app);
  const uniqueId = uuidv4();
  const navigate = useNavigate();
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
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [formValidIngredient, setFormValidIngredient] = useState(false);
  const [formValidSteps, setFormValidSteps] = useState(true);
  useEffect(() => {
    const fetchIngredients = async () => {
      const { data } = await axios.get(
        `${apiURL}/api/v1/ingredient/get-ingredient`
      );
      setIngredientOptions(data.ingredient);
    };

    const fetchCategories = async () => {
      const { data } = await axios.get(
        `${apiURL}/api/v1/category/get-all-category-admin`
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
    if (!mediaTitle) {
      alert("Vui lòng tải ảnh.");
      return;
    }
    if (courseId && !video) {
      alert("Vui lòng tải video.");
      return;
    }
    if (!formValidIngredient) {
      alert(
        "Hãy hoàn thiện form nguyên liệu hoặc check lại giá trị số lượng phải là số dương"
      );
      return;
    }
    if (!formValidSteps) {
      alert("Các bước hiện có không được để trống");
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
                `images/post/${uniqueId}/steps/step${
                  index + 1
                }/${generateRandom()}`
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
      intendTime,
      steps: stepsWithUrls,
      ingredients: ingredients.map((ingredient) => ({
        id: ingredient._id,
        quantity: ingredient.quantity,
      })),
      categories: getSelectedCategoryIds(),
      courseId,
    };
    try {
      const postSave = await axios.post(
        `${apiURL}/api/v1/post/create-post`,
        postData
      );
      console.log("Post Data: ", postSave);
      navigate(`/${role}/recipe-detail/${postSave.data.post._id}`);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
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
        <TitleForm title={title} setTitle={setTitle} />
        <MediaTitleForm mediaTitle={mediaTitle} setMediaTitle={setMediaTitle} />
        <VideoForm
          video={video}
          setVideo={setVideo}
          require={courseId && true}
        />
        <DescriptionForm
          description={description}
          setDescription={setDescription}
        />
        <RationForm ration={ration} setRation={setRation} />
        <LevelForm level={level} setLevel={setLevel} />
        <IntendTimeForm intendTime={intendTime} setIntendTime={setIntendTime} />
        <IngredientForm
          ingredients={ingredients}
          ingredientOptions={ingredientOptions}
          addIngredient={addIngredient}
          handleChangeIngredient={handleChangeIngredient}
          handleRemoveIngredient={handleRemoveIngredient}
        />
        <StepForm
          steps={steps}
          handleChangeStepDescription={handleChangeStepDescription}
          handleRemoveStep={handleRemoveStep}
          handleStepImageChange={handleStepImageChange}
          handleRemoveImage={handleRemoveImage}
          addStep={addStep}
          validateFormSteps
        />
        <CategoryForm
          categoryOptions={categoryOptions}
          handleSelectionChange={handleSelectionChange}
        />
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
