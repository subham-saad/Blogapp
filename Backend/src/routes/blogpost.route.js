import { Router } from "express";
import { createPost, getPosts, updatePost, deletePost   } from "../controllers/blogpost.controller.js";


const router = Router()


router.route("/createblog").post((req, res) => {
    try {
        createPost(req, res)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.route('/post').get(getPosts);
router.route('/updatepost/:id').patch(updatePost);

// Delete a post
router.route('/deletepost/:id').delete(deletePost);
export default router