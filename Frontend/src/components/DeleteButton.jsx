import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const DeleteButton = ({ postId, onDelete }) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      // Make a DELETE request to delete the post
      const response = await fetch(`${import.meta.env.VITE_MY_URL}/api/v1/creator/deletepost/${postId}`, {
        method: 'DELETE',
      });

      const deletedPost = await response.json();
      onDelete(deletedPost); // Notify parent component about the deletion
      handleClose(); // Close the confirmation dialog
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="error" onClick={handleOpen}>
        Delete
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this post?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

DeleteButton.propTypes = {
  postId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteButton;
