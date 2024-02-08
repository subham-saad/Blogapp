// import { useState, useEffect } from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import { Typography } from '@mui/material';
// import BlogPost from './BlogPost';

// const BlogPostPage = () => {
//   const [updateSuccess, setUpdateSuccess] = useState(false);
//   const navigate = useNavigate();

//   const handlePostUpdate = () => {
//     setUpdateSuccess(true);
//     // Automatically redirect to the success message route after 2 seconds
//     setTimeout(() => {
//       setUpdateSuccess(false);
//       navigate('/success-message');
//     }, 2000);
//   };

//   return (
//     <div>
//       <Outlet />
//       {updateSuccess && (
//         <Typography variant="h6" color="success">
//           Post updated successfully!
//         </Typography>
//       )}
//       {/* Additional content or components */}
//     </div>
//   );
// };

// export default BlogPostPage;
