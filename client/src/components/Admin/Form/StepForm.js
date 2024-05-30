import React from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { CloudUpload, Add, Delete, Clear } from "@mui/icons-material";
import { Image } from "antd";

export default function StepForm({
  steps,
  setSteps,
  handleChangeStepDescription,
  handleRemoveStep,
  handleStepImageChange,
  handleRemoveImage,
  addStep,
  validateFormSteps,
}) {
  return (
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
                  onChange={(e) => handleStepImageChange(index, e.target.files)}
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
                  src={
                    image && typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
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
  );
}
