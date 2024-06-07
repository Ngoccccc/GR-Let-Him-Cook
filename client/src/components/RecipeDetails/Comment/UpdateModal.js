import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
} from "@mui/material/";
import { CloudUpload, Clear, Cancel, Edit } from "@mui/icons-material";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Image } from "antd";
import axios from "axios";
import imageCompression from "browser-image-compression";
import apiURL from "../../../instances/axiosConfig";

const UpdateModal = ({ open, handleClose, comment, storage, setComments }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    if (comment) {
      setContent(comment.content);
      setImage(comment.image ? { name: comment.image.split("/").pop() } : null);
      setImagePreview(comment.image ? comment.image : null);
    }
  }, [comment]);
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
      setImagePreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error("Error compressing the image", error);
    }
  };

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
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? updatedComment : comment
        )
      );
      setContent("");
      setImage(null);
      setUploading(false);
    } catch (err) {
      console.log(err);
    }
  };
  const handleUpload = async () => {
    try {
      setUploading(true);
      if (image) {
        const imageName = `image_${comment._id}`;
        const storageRef = ref(storage, `images/comment/${imageName}`);
        await deleteObject(storageRef);
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
              handleCommentSubmit(downloadURL, comment._id);
              handleClose();
            });
          }
        );
      } else {
        handleCommentSubmit("", comment._id);
        handleClose();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md" // or "lg" depending on how large you want it
    >
      <DialogTitle>Chỉnh sửa bình luận</DialogTitle>
      {!comment ? (
        "Loading"
      ) : (
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            margin="normal"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUpload />}
            >
              Tải lên ảnh
            </Button>
          </label>
          {image && (
            <Grid
              sx={{
                mt: 1,
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Image height={250} src={imagePreview} />
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
        </DialogContent>
      )}

      <DialogActions>
        <Button onClick={handleClose} color="error">
          <Cancel />
          Hủy bỏ
        </Button>
        <Button onClick={handleUpload} color="primary" disabled={uploading}>
          <Edit />
          {uploading ? "Đang lưu" : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateModal;
