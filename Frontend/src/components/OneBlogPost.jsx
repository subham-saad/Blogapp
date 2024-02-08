
import styled from 'styled-components';
import { Paper, Typography } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
const StyledPaper = styled(Paper)`
  padding: 16px;
  margin: 16px 0;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OneBlogPost = () => {
  // Use useLocation hook to get the location object
  const location = useLocation();
  const { state } = location;

  if (!state || !state.post) {
    // Handle the case when the post data is not available
    return <p>Post data not found</p>;
  }

  const { post } = state;

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h4" gutterBottom>
        {post.title}
      </Typography>
      {post.coverImage && (
              <img
                src={post.coverImage}
                alt="Cover"
                style={{ marginBottom: '16px', display: 'flex', maxHeight:"200px", width:"40%", alignItems: 'center' }}
              />
      )}
      <Typography variant="body1" paragraph>
        {post.descriptions}
      </Typography>
      <FlexContainer>
        <div>
          <Typography variant="subtitle2" color="textSecondary">
            Creator: {post.creatorname}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Created at: {new Date(post.createdAt).toLocaleString()}
          </Typography>
        </div>
        {/* <Chip label={post.categorydescriptions} color="primary" /> */}
        <div className='bg-red-200'>{post.categorydescriptions}</div>
      </FlexContainer>
      <Link className='bg-green-700 p-1 m-6 flex  justify-center rounded-lg text-white w-72' to={`/edit/${post._id}`}>
                  Edit
      </Link>
     
    </StyledPaper>
  );
};

export default OneBlogPost;
