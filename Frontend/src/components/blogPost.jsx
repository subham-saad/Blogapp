import { useState, useEffect } from 'react';
import { Typography, Paper, TextField, Button, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import DeleteButton from './DeleteButton';

function trimDescription(description, maxWords) {
  const words = description.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return description;
}

function BlogPost() {
  const [postData, setPostData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt:desc'); // Default sorting order
  const navigate = useNavigate();

  useEffect(() => {
    const searchURL = `http://localhost:8000/api/v1/creator/post?search=${searchTerm}&sortBy=${sortBy}`;
    fetch(searchURL)
      .then(response => response.json())
      .then(data => setPostData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [searchTerm, sortBy]);

  const handlePostClick = (postId) => {
    const selectedPost = postData.find(post => post._id === postId);
    navigate('/oneblogpost', { state: { post: selectedPost } });
  };

  const handlePostDelete = (deletedPost) => {
    // Update state to remove the deleted post
    setPostData(prevPosts => prevPosts.filter(post => post._id !== deletedPost._id));
  };

  const handleSortByDate = () => {
    setSortBy(sortBy === 'createdAt:desc' ? 'createdAt:asc' : 'createdAt:desc');
  };

  const sortedPosts = postData.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortBy === 'createdAt:desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className='p-8'>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
       
        <TextField
          style={{ width: '60%', margin: '10px' }}
          label="Search Articles"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleSortByDate}
          style={{
            margin: '10px',
          }}
        >
          {sortBy === 'createdAt:desc' ? 'Sort Ascending' : 'Sort Descending'}
        </Button>
      </div>
      {sortedPosts.length > 0 ? (
        sortedPosts.map(post => (
          <Paper
            key={post._id}
            elevation={3}
            style={{ padding: '16px', margin: '16px 0' }}
          >
    
       
           <span className='flex' onClick={() => handlePostClick(post._id)}>
            <Avatar
                alt="Avatar"
                src="https://placekitten.com/64/64" // Replace with the URL of your avatar image
                sx={{ width: 40, height: 40, marginRight: '10px' }} // Adjust size and margin as needed
                />
              <Link to="#" style={{ color: 'blue', transition: 'color 0.3s' }}>
                <Typography variant="h4" gutterBottom>
                  {post.title}
                </Typography>
              </Link>
            </span>
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt="Cover"
                style={{ marginBottom: '16px', display: 'flex', maxHeight:"200px", width:"40%", alignItems: 'center' }}
              />
            )}
            <Typography variant="body1" paragraph>
              {trimDescription(post.descriptions, 100)}
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" color="textSecondary">
                Creator: {post.creatorname}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Created at: {new Date(post.createdAt).toLocaleString()}
              </Typography>
              <Typography style={{ color: "blue" }} variant="subtitle2" color="textSecondary">
                #{post.categorydescriptions}
              </Typography>
              <DeleteButton postId={post._id} onDelete={handlePostDelete} />
            </div>
          </Paper>
        ))
      ) : (
        <p>No articles found.</p>
      )}
    </div>
  );
}

export default BlogPost;

