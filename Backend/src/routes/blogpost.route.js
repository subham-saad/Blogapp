import { Router } from "express";
import { createPost, getPosts, updatePost, deletePost, getPostById, LoginCreator, logoutUser,   } from "../controllers/blogpost.controller.js";
import { upload } from "../middlewares/multter.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


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
export default router