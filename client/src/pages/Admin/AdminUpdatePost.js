import React, { useState, useEffect, useRef } from "react";
import { Button, Box, Paper, Typography } from "@mui/material";
import axios from "axios";
import app from "../../firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  getStorage,
  deleteObject,
} from "firebase/storage";
import { useParams } from "react-router-dom";
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
import extractImageName from "../../utils/extractImageName";
import { useNavigate } from "react-router-dom";
export default function AdminUpdatePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState(null);
  const [uniqueId, setUniqueId] = useState("");
  const oldStepsRef = useRef([]);
  const getPost = async () => {
    try {
      const { data } = await axios.get(`/api/v1/post/get-post/${id}`);
      setPost(data.post);
      console.log(data);
      setSelectedCategories(data.post.categories);
      setDescription(data.post.description);
      setTitle(data.post.title);
      setRation(data.post.ration);
      setLevel(data.post.level);
      setIntendTime(data.post.intendTime);
      setIngredients(data.post.ingredients);
      setSteps([...data.post.steps]);
      oldStepsRef.current = JSON.parse(JSON.stringify(data.post.steps));
      setMediaTitle(data.post.mediaTitle);
      setVideo(data.post.video);
      const regex = /\/images%2Fpost%2F([^%]+)%2FmediaTitle/;
      const match = data.post.mediaTitle.match(regex);

      setUniqueId(match ? match[1] : null);
      setLoading(false);
    } catch (error) {
      setStatus(error.response.status);
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getPost();
  }, [id]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const storage = getStorage(app);

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
    { _id: "", name: "", quantity: 1, unit: "", slug: "" },
  ]);
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

  const handleUploadSingleFile = async (file, filename) => {
    const storageRef = ref(storage, filename);
    await deleteObject(storageRef);
    if (file) await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const deleteOldFiles = async () => {
    const filesToDelete = findMissingImageUrls(oldStepsRef.current, steps);
    if (filesToDelete.length > 0) {
      for (const url of filesToDelete) {
        try {
          const imageRef = ref(storage, extractImageName(url));
          await deleteObject(imageRef);
          console.log("Deleted:", url);
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      }
    } else {
      console.log("No files to delete.");
    }
  };

  function findMissingImageUrls(oldSteps, newSteps) {
    const missingUrls = [];

    oldSteps.forEach((oldStep) => {
      oldStep.imageUrls.forEach((oldUrl) => {
        const isUrlInNewSteps = newSteps.some((newStep) =>
          newStep.imageUrls.some((newUrl) => newUrl === oldUrl)
        );
        if (!isUrlInNewSteps) {
          missingUrls.push(oldUrl);
        }
      });
    });

    return missingUrls;
  }
  const handleSubmit = async (event) => {
    console.log();
    event.preventDefault();
    validateFormIngredient();
    validateFormSteps();

    // if (!formValidIngredient || !formValidSteps) {
    //   alert(
    //     "Hãy hoàn thiện các form và check lại giá trị số lượng phải là số dương"
    //   );
    //   return;
    // }
    setLoading(true);

    // Tiếp tục xử lý upload các tệp mới
    const stepsWithUrls = await Promise.all(
      steps.map(async (step, index) => {
        const imageUrls = await Promise.all(
          step.imageUrls.map(async (file, i) =>
            typeof file === "string"
              ? file
              : await handleUploadSingleFile(
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

    const imageUrl =
      typeof mediaTitle === "string"
        ? mediaTitle
        : await handleUploadSingleFile(
            mediaTitle,
            `images/post/${uniqueId}/mediaTitle`
          );
    const videoUrl =
      typeof video === "string"
        ? video
        : await handleUploadSingleFile(video, `video/post/${uniqueId}`);
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
    };
    console.log("Old step", oldStepsRef.current, "New Step", steps);
    deleteOldFiles();
    try {
      const postSave = await axios.put(
        `/api/v1/post/update-post/${id}`,
        postData
      );
      console.log("Post Data: ", postSave);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
    navigate(`/admin/recipe-detail/${id}`);
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
        Chỉnh sửa công thức nấu ăn: {title || ""}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TitleForm title={title} setTitle={setTitle} />
        <MediaTitleForm mediaTitle={mediaTitle} setMediaTitle={setMediaTitle} />
        <VideoForm video={video} setVideo={setVideo} />
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
          selectedCategories={selectedCategories}
        />
        <Button
          variant="contained"
          type="submit"
          size="large"
          disabled={loading}
        >
          Chỉnh sửa bài đăng
        </Button>
      </Box>
    </Paper>
  );
}
