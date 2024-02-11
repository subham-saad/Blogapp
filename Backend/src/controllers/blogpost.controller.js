import { Blogpost } from "../models/blogpost.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

// const generateAccessAndRefereshTokens = async (Id) => {
//    try {
//     const creator = await Blogpost.findById(Id)
//     const accessToken = Blogpost.generateAccessToken();
//     const refreshToken = Blogpost.generateRefreshToken();

//     creator.refreshToken = refreshToken;
//     await creator.save({ validateBeforeSave: false});
//     console.log(accessToken, refreshToken)
//     return { accessToken, refreshToken };
//    } catch (error) {
//      throw new ApiError(500, "Something went wrong");
//    }
// };

const generateAccessAndRefereshTokens = async (adminId) => {
  try {
      const admin = await Blogpost.findById(adminId);
      const accessToken = admin.generateAccessToken();
      const refreshToken = admin.generateRefreshToken();

      admin.refreshToken = refreshToken;
      await admin.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
      
  } catch (error) {
      throw new ApiError(500, "Something went wrong");
  }
};


export const createPost = asyncHandler (async (req, res) => {
    const { title, descriptions,  categorydescriptions,  creatorname, email, password } = req.body;

    if (
        [ title, descriptions,  categorydescriptions,  creatorname, email, password ].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await Blogpost.findOne({
      $or: [{ creatorname}, { email }]
  })

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists")
}
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
     
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    const post = await Blogpost.create({
        title, 
        descriptions,  
        categorydescriptions,  
        creatorname,
        coverImage: coverImage?.url || "",
        email, 
        password,
    })

    const createdUser = await Blogpost.findById(post._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }


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
  
  export const LoginCreator = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, password} = req.body
    console.log(email);
    console.log(password)
    
    if (!email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const admin = await Blogpost.findOne({
        $or: [{email}]
    })

    if (!admin) {
        throw new ApiError(404, "User does not exist")
    }

  const isPasswordValid = await admin.isPasswordCorrect(password)
  console.log(isPasswordValid)
   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(admin._id)
   console.log("tokens", refreshToken)

    const loggedInUser = await Blogpost.findById(admin._id).select("-password -refreshToken")
     
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                admin: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

  