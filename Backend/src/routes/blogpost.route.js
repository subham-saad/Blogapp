import { Router } from "express";
import { createPost, getPosts, updatePost, deletePost, getPostById, LoginCreator, logoutUser,  sharePost, likePost, addComment, getComments, deleteComment, registerUser} from "../controllers/blogpost.controller.js";
import { upload } from "../middlewares/multter.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  
} from '../controllers/notification.controller.js';

const router = Router()

// Public routes
router.route("/register").post(
  upload.single("avatar"), // Optional avatar upload
  registerUser
);

// Blogpost routes
router.route("/createblog").post(
    
    upload.fields([
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    (req, res) => {
    try {
        createPost(req, res)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})
router.route('/logincreator').post(LoginCreator);
router.route('/logout').post(verifyJWT, logoutUser)
router.route('/post').get(getPosts);


router.route('/updatepost/:id').patch(updatePost);
router.route('/getpost/:id').get(getPostById )

// Delete a post
router.route('/deletepost/:id').delete(deletePost);

// notification routes 

router.route('/:userId').get(getNotifications);
router.route('/mark-read/:notificationId').patch(markAsRead);
router.route('/mark-all-read/:userId').patch(markAllAsRead);
router.route('/unread-count/:userId').get(getUnreadCount);

// post share routes
router.route('/:id/share').post(sharePost);
router.route('/:id/like').post(likePost);
router.route('/:id/comment').post(addComment);
router.route('/:id/comments').get(getComments);
router.route('/:id/comment/:commentIndex').delete(deleteComment);


export default router