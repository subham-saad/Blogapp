import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BlogPost from './components/blogPost';
import OneBlogPost from './components/oneBlogPost';
import NavBar from './components/NavBar';
 import CreateBlogForm from './components/CreateBlogPost';
 import EditBlogForm from './components/EditBlogForm';
 import Login from './components/LoginCreator'


function App() {
  const [updatedPost, setUpdatedPost] = useState(null);

  const handleUpdate = (updatedPostData) => {
    // Handle the updated post data, for example, update the state
    setUpdatedPost(updatedPostData);
  };

  const handleClose = () => {
    // Handle closing the edit form, for example, navigate to another page
    // In this example, we reset the updated post state
    setUpdatedPost(null);
  };
  return (
    <Router>
      <NavBar />
      {/* <BlogPost /> */}
      {/* <OneBlogPost /> */}
      <Routes>
        <Route path="/" element={<BlogPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createblog" element={<CreateBlogForm/>}/>
        <Route path="/oneblogpost" element={<OneBlogPost />} />
        <Route path="/edit/:postId" element={<EditBlogForm onUpdate={handleUpdate} onClose={handleClose} />}/>
      </Routes>
    </Router>
  );
}

export default App;

