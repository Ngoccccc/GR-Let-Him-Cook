import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CancelIcon from "@mui/icons-material/Cancel";
import { red, grey } from "@mui/material/colors";

export default function DeleteModal({ open, setOpen, handleDelete }) {
  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteClose = () => {
    handleDelete();
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title" sx={{ margin: "auto" }}>
        <CancelIcon sx={{ color: red[500], fontSize: 80 }} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Bạn có chắc chắn muốn xóa comment này không
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button sx={{ color: grey[900] }} onClick={handleClose}>
          Bỏ qua
        </Button>
        <Button sx={{ color: red[500] }} onClick={handleDeleteClose} autoFocus>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
}
