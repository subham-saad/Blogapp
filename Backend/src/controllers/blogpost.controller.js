import { Blogpost } from "../models/blogpost.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const createPost = asyncHandler (async (req, res) => {
    const { title, descriptions,  categorydescriptions,  creatorname } = req.body;

    if (
        [ title, descriptions,  categorydescriptions,  creatorname ].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const post = await Blogpost.create({
        title, 
        descriptions,  
        categorydescriptions,  
        creatorname
    })
    return res.status(201).json(
        new ApiResponse(200, post, "Post Successfully")
    )
 
} )


export const getPosts = async (req, res) => {
    const { search, sortBy } = req.query;
  
    try {
      let query = {};
  
      if (search) {
        // If search term is provided, add a case-insensitive regex search to the query
        query = {
          $or: [
            { title: { $regex: new RegExp(search, 'i') } },
            { descriptions: { $regex: new RegExp(search, 'i') } },
            { creatorname: { $regex: new RegExp(search, 'i') } },
            { categorydescriptions: { $regex: new RegExp(search, 'i') } },
          ],
        };
      }
  
      const posts = await Blogpost.find(query).sort({ createdAt: sortBy === 'asc' ? 1 : -1 });
  
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const getPostById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const post = await Blogpost.findById(id);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  export const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, descriptions, categorydescriptions, creatorname } = req.body;
  
    if (
      [title, descriptions, categorydescriptions, creatorname].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }
  
    const updatedPost = await Blogpost.findByIdAndUpdate(
      id,
      {
        title,
        descriptions,
        categorydescriptions,
        creatorname,
      },
      { new: true }
    );
  
    if (!updatedPost) {
      throw new ApiError(404, "Post not found");
    }
  
    return res.status(200).json(
      new ApiResponse(200, updatedPost, "Post updated successfully")
    );
  });
  

  export const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const deletedPost = await Blogpost.findByIdAndDelete(id);
  
    if (!deletedPost) {
      throw new ApiError(404, "Post not found");
    }
  
    return res.status(200).json(
      new ApiResponse(200, deletedPost, "Post deleted successfully")
    );
  });
  

  