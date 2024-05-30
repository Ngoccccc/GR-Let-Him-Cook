import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { CloudUpload, Clear } from "@mui/icons-material";
import { Image } from "antd";

export default function MediaTitleForm({ mediaTitle, setMediaTitle }) {
  return (
    <Grid sx={{ my: 1 }}>
      <Typography variant="h6" gutter>
        Ảnh đại diện*
      </Typography>
      <Button component="label" variant="contained" startIcon={<CloudUpload />}>
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
          <Image
            width={300}
            src={
              mediaTitle && typeof mediaTitle === "string"
                ? mediaTitle
                : URL.createObjectURL(mediaTitle)
            }
          />
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
  );
}
