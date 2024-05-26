import React from "react";
import { Grid, Typography } from "@mui/material/";
import { Image } from "antd";
const Steps = ({ steps }) => {
  return (
    <Grid
      container
      direction="column"
      sx={{
        my: 3,
        pb: 3,
        display: "flex",
      }}
    >
      <Typography variant="h5" component="h2" fontWeight="bold">
        Hướng dẫn thực hiện
      </Typography>
      {steps
        .sort((a, b) => a.order - b.order)
        .map((step, index) => (
          <Grid
            key={index}
            sx={{
              py: 2,
              display: "flex",
            }}
          >
            <Typography>{step.order}. </Typography>
            <Grid sx={{ ml: 3 }}>
              <Typography sx={{ mb: 3 }}>{step.description}</Typography>
              <Image.PreviewGroup>
                {step.imageUrls.map((image, index) => (
                  <Image key={index} width={200} src={image} />
                ))}
              </Image.PreviewGroup>
            </Grid>
          </Grid>
        ))}
    </Grid>
  );
};

export default Steps;
