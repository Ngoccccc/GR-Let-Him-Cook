import React, { useState, useEffect } from "react";
import { Grid, Typography, Avatar, Button, TextField } from "@mui/material/";
import {
  AccessTime as AccessTimeIcon,
  Comment,
  CloudUpload,
  Clear,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Image } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import app from "../../../firebase";
import DeleteModal from "./DeleteModal";
import { useAuth } from "../../../context/auth"; // Import authentication context
import UpdateModal from "./UpdateModal";
import imageCompression from "browser-image-compression";
import apiURL from "../../../instances/axiosConfig";

const Comments = () => {
  const { id } = useParams();
  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [comments, setComments] = useState([]);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [editingComment, setEditingComment] = useState({});
  const [auth] = useAuth(); // Get current user
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const storage = getStorage(app);

  const getComments = async (post) => {
    try {
      const { data } = await axios.get(
        `${apiURL}/api/v1/comment/get-comments/${post}`
      );
      setComments(data.comments);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) {
      getComments(id);
    }
  }, [id]);

  const handleImageChange = async (event) => {
    const selectedFile = event.target.files[0];
    // Nén ảnh
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(selectedFile, options);
      setImage(compressedFile);
    } catch (error) {
      console.error("Error compressing the image", error);
    }
  };

  // Hàm này xử lý cho cả tạo và update comment
  const handleCommentSubmit = async (imageURL, commentId) => {
    try {
      const response = await axios.put(
        `${apiURL}/api/v1/comment/update-comment/${commentId}`,
        {
          image: imageURL,
          content: content,
        }
      );
      const updatedComment = response.data.updatedComment;
      // Kiểm tra xem comment có tồn tại không
      const commentExists = comments.some(
        (comment) => comment._id === commentId
      );
      setComments([...comments, updatedComment]);
      setContent("");
      setImage(null);
      setUploading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpload = async () => {
    try {
      if (!content) {
        alert("Vui lòng nhập gì đó để bình luận");
        return;
      }
      setUploading(true);
      const response = await axios.post(
        `${apiURL}/api/v1/comment/create-comment/${id}`,
        {
          content,
        }
      );
      const commentId = response.data.comment._id;

      if (image) {
        const imageName = `image_${commentId}`;
        const storageRef = ref(storage, `images/comment/${imageName}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Handle upload progress here if needed
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              handleCommentSubmit(downloadURL, commentId);
            });
          }
        );
      } else {
        handleCommentSubmit("", commentId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment);
    setOpenUpdateModal(true);
  };

  const handleDelete = async (commentId) => {
    try {
      const { data } = await axios.delete(
        `${apiURL}/api/v1/comment/delete-comment/${commentId}`
      );
      if (data.deletedComment.image) {
        const imageName = `image_${commentId}`;
        const imageRef = ref(storage, `images/comment/${imageName}`);
        await deleteObject(imageRef);
      }
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      {!comments ? (
        "Loading"
      ) : (
        <>
          <Grid sx={{ py: 2 }} textAlign="center">
            <Typography variant="h5" component="h2" fontWeight="bold">
              <Comment sx={{ mr: 1 }} />
              {comments.length} bình luận
            </Typography>
          </Grid>
          <Grid sx={{ pb: 3 }} borderBottom={1} borderColor="divider">
            {comments.map((comment, index) => (
              <Grid key={index}>
                <Grid sx={{ display: "flex", mb: 4 }}>
                  <Avatar
                    alt={comment.userId.name}
                    src="/static/images/avatar/3.jpg"
                    sx={{ width: 60, height: 60 }}
                  />
                  <Grid sx={{ pl: 3, flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" fontWeight="bold">
                      {comment.userId.name}
                    </Typography>
                    <Grid sx={{ display: "flex", mt: 1 }}>
                      <AccessTimeIcon />
                      <Typography>{comment.createdAt}</Typography>
                    </Grid>
                    <Grid
                      sx={{
                        mt: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Grid>
                        <Typography sx={{ mb: 1 }} variant="h6" component="h2">
                          {comment.content}
                        </Typography>
                        {comment.image && (
                          <Image
                            width={200}
                            alt={comment.content}
                            src={comment.image}
                          />
                        )}
                      </Grid>
                      <Grid>
                        {auth?.user?._id === comment.userId._id && (
                          <Grid sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="text"
                              onClick={() => handleEdit(comment)}
                            >
                              <EditIcon />
                            </Button>

                            <Button
                              variant="text"
                              onClick={() => setOpenDeleteModal(true)}
                              color="error"
                            >
                              <DeleteIcon />
                            </Button>
                            <DeleteModal
                              open={openDeleteModal}
                              setOpen={setOpenDeleteModal}
                              handleDelete={() => handleDelete(comment._id)}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>

          {auth?.token ? (
            <Grid sx={{ mt: 3, mb: 5 }}>
              <Typography variant="h6" component="h2" fontWeight="bold">
                Thêm bình luận
              </Typography>
              <TextField
                label="Bình luận gì đó"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                margin="normal"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="upload-image-input"
              />
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUpload />}
                >
                  Tải ảnh
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                </Button>
                <Button
                  onClick={handleUpload}
                  variant="contained"
                  color="primary"
                  disabled={uploading}
                >
                  {uploading ? "Đang bình luận" : "Bình luận"}
                </Button>
              </Grid>
              {image && (
                <Grid
                  sx={{
                    mt: 1,
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <Image width={300} src={URL.createObjectURL(image)} />
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
          ) : (
            <Typography
              sx={{ my: 2 }}
              variant="h6"
              component="h2"
              fontWeight="bold"
            >
              Đăng nhập để thêm bình luận
            </Typography>
          )}
        </>
      )}
      <UpdateModal
        open={openUpdateModal}
        comment={editingComment}
        handleClose={() => setOpenUpdateModal(false)}
        storage={storage}
        setComments={setComments}
      />
    </div>
  );
};

export default Comments;
