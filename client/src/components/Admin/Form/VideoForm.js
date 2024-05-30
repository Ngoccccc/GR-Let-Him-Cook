import React, { useEffect, useRef } from "react";
import { Button, Grid, Typography } from "@mui/material";
import { CloudUpload, Clear } from "@mui/icons-material";

export default function VideoForm({ video, setVideo }) {
  const videoRef = useRef();

  useEffect(() => {
    if (video && videoRef.current) {
      const videoURL =
        typeof video === "string" ? video : URL.createObjectURL(video);
      videoRef.current.src = videoURL;

      return () => {
        if (typeof video !== "string") {
          URL.revokeObjectURL(videoURL);
        }
      };
    }
  }, [video]);

  return (
    <Grid sx={{ my: 1 }}>
      <Typography variant="h6" gutter>
        Video hướng dẫn
      </Typography>
      <Button component="label" variant="contained" startIcon={<CloudUpload />}>
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
          <video width="300" controls ref={videoRef}>
            <source />
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
  );
}
