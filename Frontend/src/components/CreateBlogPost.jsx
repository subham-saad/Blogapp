import { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Snackbar } from '@mui/material';

const CreateBlogForm = () => {
  const [creatorName, setCreatorName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCreatorNameChange = (event) => {
    setCreatorName(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleBlogContentChange = (event) => {
    setBlogContent(event.target.value);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async () => {
    try {
      // Make a network request to your backend API using fetch
      const response = await fetch('http://localhost:8000/api/v1/creator/createblog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorname: creatorName,
          title: title,
          categorydescriptions: category,
          descriptions: blogContent,
        }),
      });

      // Parse the response
      const data = await response.json();

      // Handle the response from the backend
      setSuccessMessage(data.message);
      setOpenSnackbar(true);
      // You can also handle the success response and update your UI accordingly
    } catch (error) {
      console.error('Error creating blog:', error.message);
      // Handle the error response and update your UI accordingly
    }
  };

  return (
    <div className='p-6'>
      <TextField
        label="Creator Name"
        variant="outlined"
        fullWidth
        value={creatorName}
        onChange={handleCreatorNameChange}
        margin="normal"
      />
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        value={title}
        onChange={handleTitleChange}
        margin="normal"
      />
      <TextField
        label="Write Your Blog"
        variant="outlined"
        fullWidth
        multiline
        rows={6}
        value={blogContent}
        onChange={handleBlogContentChange}
        margin="normal"
      />
      <FormControl variant="outlined" fullWidth margin="normal">
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category"
          value={category}
          onChange={handleCategoryChange}
          label="Category"
        >
          <MenuItem value="technology">Technology</MenuItem>
          <MenuItem value="education">Education</MenuItem>
          <MenuItem value="food">Food</MenuItem>
          <MenuItem value="business">Businessmen</MenuItem>
          {/* Add more categories as needed */}
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Create Blog
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={successMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />
    </div>
  );
};

export default CreateBlogForm;
