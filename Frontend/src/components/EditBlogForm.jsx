import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const EditBlogForm = ({ onUpdate, onClose }) => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
//     const [formData, setFormData] = useState({
//     title: '',
//     descriptions: '',
//     categorydescriptions: '',
//     creatorname: '',
//   });
  useEffect(() => {
    // Fetch the post data using postId and set it in the form
    const fetchPostData = async () => {
      try {
        const response = await fetch(`MY_URL/api/v1/creator/post/${postId}`);
        const postData = await response.json();
        setFormData(postData);
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    fetchPostData();
  }, [postId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      // Make a PATCH request to update the post
      const response = await fetch(`http://localhost:8000/api/v1/creator/updatepost/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Notify parent component about the update
        onUpdate(formData);

        // Automatically navigate to the / route after a successful update
        navigate('/');

        // Close the edit form
        onClose();
      } else {
        console.error('Error updating post:', response.status);
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div>
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        margin="normal"
      />
      <TextField
        label="Descriptions"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        name="descriptions"
        value={formData.descriptions}
        onChange={handleInputChange}
        margin="normal"
      />
      <FormControl variant="outlined" fullWidth margin="normal">
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category"
          name="categorydescriptions"
          value={formData.categorydescriptions}
          onChange={handleInputChange}
          label="Category"
        >
          <MenuItem value="technology">Technology</MenuItem>
          <MenuItem value="travel">Travel</MenuItem>
          <MenuItem value="food">Food</MenuItem>
          {/* Add more categories as needed */}
        </Select>
      </FormControl>
      <TextField
        label="Creator Name"
        variant="outlined"
        fullWidth
        name="creatorname"
        value={formData.creatorname}
        onChange={handleInputChange}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleUpdate}>
        Update Post
      </Button>
    </div>
  );
};

EditBlogForm.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

export default EditBlogForm;

// import { useState, useEffect } from 'react';
// import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import { useParams, useNavigate } from 'react-router-dom';

// const EditBlogForm = ({ onUpdate, onClose }) => {
//   const { postId } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: '',
//     descriptions: '',
//     categorydescriptions: '',
//     creatorname: '',
//   });

//   useEffect(() => {
//     const fetchPostData = async () => {
//       try {
//         const response = await fetch(`http://localhost:8000/api/v1/creator/post/${postId}`);
//         const postData = await response.json();

//         // Set the form state with the fetched data
//         setFormData(postData);
//       } catch (error) {
//         console.error('Error fetching post data:', error);
//       }
//     };

//     fetchPostData();
//   }, [postId]);

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     // Update the form state with the changed value
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleUpdate = async () => {
//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/creator/updatepost/${postId}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         // Notify parent component about the update
//         onUpdate(formData);

//         // Automatically navigate to the / route after a successful update
//         navigate('/');

//         // Close the edit form
//         onClose();
//       } else {
//         console.error('Error updating post:', response.status);
//       }
//     } catch (error) {
//       console.error('Error updating post:', error);
//     }
//   };

//   return (
//     <div>
//       <TextField
//         label="Title"
//         variant="outlined"
//         fullWidth
//         name="title"
//         value={formData.title}
//         onChange={handleInputChange}
//         margin="normal"
//       />
//       <TextField
//         label="Descriptions"
//         variant="outlined"
//         fullWidth
//         multiline
//         rows={4}
//         name="descriptions"
//         value={formData.descriptions}
//         onChange={handleInputChange}
//         margin="normal"
//       />
//       <FormControl variant="outlined" fullWidth margin="normal">
//         <InputLabel id="category-label">Category</InputLabel>
//         <Select
//           labelId="category-label"
//           id="category"
//           name="categorydescriptions"
//           value={formData.categorydescriptions}
//           onChange={handleInputChange}
//           label="Category"
//         >
//           <MenuItem value="technology">Technology</MenuItem>
//           <MenuItem value="travel">Travel</MenuItem>
//           <MenuItem value="food">Food</MenuItem>
//           {/* Add more categories as needed */}
//         </Select>
//       </FormControl>
//       <TextField
//         label="Creator Name"
//         variant="outlined"
//         fullWidth
//         name="creatorname"
//         value={formData.creatorname}
//         onChange={handleInputChange}
//         margin="normal"
//       />
//       <Button variant="contained" color="primary" onClick={handleUpdate}>
//         Update Post
//       </Button>
//     </div>
//   );
// };
// EditBlogForm.propTypes = {
//     onUpdate: PropTypes.func.isRequired,
//     onClose: PropTypes.func.isRequired,
//   };
// export default EditBlogForm;

