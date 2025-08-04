import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Blog Post Component
const BlogPost = ({ post, currentUser }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Initialize post stats with safe defaults
    if (post) {
      setLikeCount(post.likes?.length || 0);
      setShareCount(post.shares || 0);
      setCommentCount(post.comments?.length || 0);
      setComments(post.comments || []);
      
      // Check if current user has liked the post
      const userLiked = post.likes?.some(like => like.userId === currentUser.id) || false;
      setLiked(userLiked);
    }
  }, [post, currentUser.id]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLike = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_MY_URL}/api/v1/creator/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.name
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setLiked(data.data.liked);
        setLikeCount(data.data.likeCount);
        showMessage(data.message);
      } else {
        showMessage(data.message || 'Failed to like post');
      }
    } catch (error) {
      showMessage('Error liking post');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_MY_URL}/api/v1/creator/${post._id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.name
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setShareCount(data.data.shareCount);
        showMessage(data.message);
        
        // Also copy link to clipboard
        if (navigator.share) {
          navigator.share({
            title: post.title,
            text: post.descriptions.substring(0, 100) + '...',
            url: window.location.href
          });
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href);
          showMessage('Link copied to clipboard!');
        }
      } else {
        showMessage(data.message || 'Failed to share post');
      }
    } catch (error) {
      showMessage('Error sharing post');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_MY_URL}/api/v1/creator/${post._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.name,
          comment: newComment
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setComments(prev => [...prev, data.data.comment]);
        setCommentCount(data.data.commentCount);
        setNewComment('');
        showMessage(data.message);
      } else {
        showMessage(data.message || 'Failed to add comment');
      }
    } catch (error) {
      showMessage('Error adding comment');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentIndex) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_MY_URL}/api/v1/creator/${post._id}/comment/${commentIndex}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setComments(prev => prev.filter((_, index) => index !== commentIndex));
        setCommentCount(data.data.commentCount);
        showMessage(data.message);
      } else {
        showMessage(data.message || 'Failed to delete comment');
      }
    } catch (error) {
      showMessage('Error deleting comment');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;

  const cardStyle = {
    maxWidth: '600px',
    margin: '20px auto',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    backgroundColor: 'white',
    overflow: 'hidden'
  };

  const headerStyle = {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: '#fafafa'
  };

  const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#2196f3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    marginRight: '12px'
  };

  const chipStyle = {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '500',
    marginLeft: 'auto'
  };

  const actionButtonStyle = {
    background: 'none',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    transition: 'background-color 0.2s'
  };

  const commentInputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    outline: 'none',
    fontSize: '14px'
  };

  const commentItemStyle = {
    padding: '8px 0',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px'
  };

  return (
    <div style={cardStyle}>
      {/* Message Display */}
      {message && (
        <div style={{
          padding: '8px 16px',
          backgroundColor: '#4caf50',
          color: 'white',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          {message}
        </div>
      )}

      {/* Post Header */}
      <div style={headerStyle}>
        <div style={avatarStyle}>
          {post.creatorname?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600', fontSize: '16px' }}>
            {post.creatorname || 'Unknown User'}
          </div>
          <div style={{ color: '#666', fontSize: '12px' }}>
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
          </div>
        </div>
        <div style={chipStyle}>
          {post.categorydescriptions || 'Uncategorized'}
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      )}

      {/* Post Content */}
      <div style={{ padding: '16px' }}>
        <h2 style={{ 
          margin: '0 0 12px 0', 
          fontSize: '20px', 
          fontWeight: '600',
          color: '#333'
        }}>
          {post.title || 'Untitled Post'}
        </h2>
        <p style={{ 
          margin: '0', 
          color: '#666', 
          lineHeight: '1.6',
          fontSize: '14px'
        }}>
          {post.descriptions || 'No description available'}
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        padding: '8px 16px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '4px',
        borderTop: '1px solid #f0f0f0'
      }}>
        <button
          onClick={handleLike}
          disabled={loading}
          style={{
            ...actionButtonStyle,
            color: liked ? '#f44336' : '#666'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          {liked ? '❤️' : '🤍'}
        </button>
        <span style={{ fontSize: '14px', marginRight: '16px' }}>{likeCount}</span>

        <button
          onClick={() => setShowComments(!showComments)}
          style={{...actionButtonStyle, color: '#666'}}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          💬
        </button>
        <span style={{ fontSize: '14px', marginRight: '16px' }}>{commentCount}</span>

        <button
          onClick={handleShare}
          disabled={loading}
          style={{...actionButtonStyle, color: '#666'}}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          📤
        </button>
        <span style={{ fontSize: '14px' }}>{shareCount}</span>

        {loading && (
          <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#666' }}>
            Loading...
          </div>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
          {/* Add Comment */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              style={commentInputStyle}
            />
            <button
              onClick={handleAddComment}
              disabled={loading || !newComment.trim()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                opacity: newComment.trim() ? 1 : 0.5
              }}
            >
              Send
            </button>
          </div>

          {/* Comments List */}
          <div>
            {comments.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                color: '#666', 
                fontSize: '14px',
                padding: '20px'
              }}>
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment, index) => (
                <div key={index} style={commentItemStyle}>
                  <div style={{
                    ...avatarStyle,
                    width: '32px',
                    height: '32px',
                    fontSize: '12px'
                  }}>
                    {comment.userName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                      {comment.userName || 'Unknown User'}
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                      {comment.comment}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {comment.commentedAt ? new Date(comment.commentedAt).toLocaleString() : 'Unknown time'}
                    </div>
                  </div>
                  {(comment.userId === currentUser.id || post.creatorId === currentUser.id) && (
                    <button
                      onClick={() => handleDeleteComment(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#f44336',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '4px'
                      }}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes validation
BlogPost.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    descriptions: PropTypes.string,
    categorydescriptions: PropTypes.string,
    creatorname: PropTypes.string,
    creatorId: PropTypes.string,
    coverImage: PropTypes.string,
    createdAt: PropTypes.string,
    likes: PropTypes.arrayOf(PropTypes.shape({
      userId: PropTypes.string,
      userName: PropTypes.string,
      likedAt: PropTypes.string
    })),
    comments: PropTypes.arrayOf(PropTypes.shape({
      userId: PropTypes.string,
      userName: PropTypes.string,
      comment: PropTypes.string,
      commentedAt: PropTypes.string
    })),
    shares: PropTypes.number
  }).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired
};

// Default props
BlogPost.defaultProps = {
  currentUser: { id: 'user123', name: 'Current User' }
};

// Blog Feed Component
const BlogFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser] = useState({ id: 'user123', name: 'Current User' }); // Replace with actual user context

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_MY_URL}/api/v1/creator/post`);
      const data = await response.json();
      
      if (response.ok) {
        // Ensure we have an array and add default values for missing properties
        const postsArray = Array.isArray(data) ? data : data.data || [];
        const normalizedPosts = postsArray.map(post => ({
          ...post,
          likes: post.likes || [],
          comments: post.comments || [],
          shares: post.shares || 0
        }));
        setPosts(normalizedPosts);
      } else {
        setError('Failed to fetch posts');
      }
    } catch (error) {
      setError('Error fetching posts');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '200px',
        fontSize: '18px'
      }}>
        Loading posts...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '200px',
        color: '#f44336',
        fontSize: '18px'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        color: '#333',
        fontSize: '28px'
      }}>
        Blog Feed
      </h1>
      
      {posts.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#666',
          fontSize: '18px',
          padding: '40px'
        }}>
          No posts available
        </div>
      ) : (
        posts.map((post) => (
          <BlogPost 
            key={post._id} 
            post={post} 
            currentUser={currentUser}
          />
        ))
      )}
    </div>
  );
};

export default BlogFeed;
