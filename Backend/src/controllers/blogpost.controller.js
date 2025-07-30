import { Blogpost } from "../models/blogpost.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { eventQueue } from "../utils/eventQueue.js";
import { User } from "../models/user.model.js";

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
      const admin = await User.findById(adminId);
      const accessToken = admin.generateAccessToken();
      const refreshToken = admin.generateRefreshToken();

      admin.refreshToken = refreshToken;
      await admin.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
      
  } catch (error) {
      throw new ApiError(500, "Something went wrong");
  }
};

// Register user controller
export const registerUser = asyncHandler(async (req, res) => {
  // Extract data from request body
  const { username, email, fullName, password, bio } = req.body;

  // Validation - check if required fields are provided
  if ([username, email, fullName, password].some(field => field?.trim() === "")) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  // Password validation
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  // Username validation
  if (username.length < 3) {
    throw new ApiError(400, "Username must be at least 3 characters long");
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Handle avatar upload (if provided)
  let avatarUrl = "";
  if (req.file) {
    // Assuming you're using multer and have file upload logic
    avatarUrl = req.file.path; // This would be the uploaded file path
  }

  // Create user object
  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    fullName,
    password,
    bio: bio || "",
    avatar: avatarUrl
  });

  // Remove password and refresh token from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Check if user was created successfully
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  // Generate tokens for immediate login after registration
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

  // Cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };

  // Send response
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: createdUser,
          accessToken,
          refreshToken
        },
        "User registered successfully"
      )
    );
});



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
  
//   export const LoginCreator = asyncHandler(async (req, res) =>{
//     // req body -> data
//     // username or email
//     //find the user
//     //password check
//     //access and referesh token
//     //send cookie

//     const {email, password} = req.body
//     console.log(email);
//     console.log(password)
    
//     if (!email) {
//         throw new ApiError(400, "username or email is required")
//     }
    
//     // Here is an alternative of above code based on logic discussed in video:
//     // if (!(username || email)) {
//     //     throw new ApiError(400, "username or email is required")
        
//     // }

//     const admin = await User.findOne({
//         $or: [{email}]
//     })

//     if (!admin) {
//         throw new ApiError(404, "User does not exist")
//     }

//   const isPasswordValid = await User.isPasswordCorrect(password)
//   console.log(isPasswordValid)
//    if (!isPasswordValid) {
//     throw new ApiError(401, "Invalid user credentials")
//     }

//    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(admin._id)
  

//     const loggedInUser = await User.findById(admin._id).select("-password -refreshToken")
    
//     const options = {
//         httpOnly: true,
//         secure: true,
       
//     }
  
//     return res
//     .status(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(
//       new ApiResponse(
//         200, 
//         {
//           admin: loggedInUser, accessToken, refreshToken
//         },
//         "User logged In Successfully"
//       )
//     );

// })
export const LoginCreator = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("Email:", email, "Password:", password);

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const admin = await User.findOne({ email});

  if (!admin) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await admin.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(admin._id);

  const loggedInUser = await User.findById(admin._id).select("-password -refreshToken");

  const isProduction = process.env.NODE_ENV === "production";

  // const options = {
  //   httpOnly: false,
  //   secure: isProduction,
  //   sameSite: isProduction ? "none" : "lax"
  // };
  const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // ✅ Only secure in production
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // ✅ Allow cross-origin cookies in dev
};

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        admin: loggedInUser,
        accessToken,
        refreshToken
      }, "User logged in successfully")
    );
});

export const logoutUser = asyncHandler(async(req, res) => {
  console.log(req.admin._id)
  await Blogpost.findByIdAndUpdate(req.admin._id,
    {
      $unset: {
        refreshToken: 1
      }
    },
    {
      new: true
    }
  )

  // const options = {
  //   httpOnly: true,
  //   secure: true
  // }
 
  return res
  .status(200)
  .clearCookie("accessToken")
  .clearCookie("refreshToken")
  .json(new ApiResponse(200, {}, "User logged out"))
})


export const createPost = asyncHandler(async (req, res) => {
    const { title, descriptions, categorydescriptions, creatorname, email, password } = req.body;

    if (
        [title, descriptions, categorydescriptions, creatorname, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await Blogpost.findOne({
        $or: [{ creatorname }, { email }]
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
        creatorId: req.user?._id, // Add this if you have auth, otherwise generate a new ObjectId
        likes: [],
        comments: [],
        shares: 0
    })

    const createdUser = await Blogpost.findById(post._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, post, "Post Created Successfully")
    )
})

// Share Post
export const sharePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId, userName } = req.body;

    if (!userId || !userName) {
        throw new ApiError(400, "User ID and name are required");
    }

    const post = await Blogpost.findById(id);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Increment share count
    post.shares = (post.shares || 0) + 1;
    await post.save();

    // Emit share event for notification (non-blocking)
    eventQueue.emit({
        type: 'share',
        actorId: userId,
        actorName: userName,
        recipientId: post.creatorId,
        resourceId: post._id,
        resourceTitle: post.title
    });

    return res.status(200).json(
        new ApiResponse(200, { shared: true, shareCount: post.shares }, "Post shared successfully")
    );
});

// Like Post
export const likePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId, userName } = req.body;

    if (!userId || !userName) {
        throw new ApiError(400, "User ID and name are required");
    }

    const post = await Blogpost.findById(id);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Initialize likes array if it doesn't exist
    if (!post.likes) {
        post.likes = [];
    }

    // Check if user already liked the post
    const userLikedIndex = post.likes.findIndex(like => like.userId === userId);
    let isLiked = false;

    if (userLikedIndex > -1) {
        // User already liked, so unlike
        post.likes.splice(userLikedIndex, 1);
        isLiked = false;
    } else {
        // User hasn't liked, so add like
        post.likes.push({
            userId,
            userName,
            likedAt: new Date()
        });
        isLiked = true;

        // Emit like event for notification (only when liking, not unliking)
        eventQueue.emit({
            type: 'like',
            actorId: userId,
            actorName: userName,
            recipientId: post.creatorId,
            resourceId: post._id,
            resourceTitle: post.title
        });
    }

    await post.save();

    return res.status(200).json(
        new ApiResponse(200, {
            liked: isLiked,
            likeCount: post.likes.length,
            likes: post.likes
        }, isLiked ? "Post liked successfully" : "Post unliked successfully")
    );
});

// Add Comment
export const addComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId, userName, comment } = req.body;

    if (!userId || !userName || !comment?.trim()) {
        throw new ApiError(400, "User ID, name, and comment are required");
    }

    const post = await Blogpost.findById(id);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Initialize comments array if it doesn't exist
    if (!post.comments) {
        post.comments = [];
    }

    const newComment = {
        userId,
        userName,
        comment: comment.trim(),
        commentedAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    // Emit comment event for notification
    eventQueue.emit({
        type: 'comment',
        actorId: userId,
        actorName: userName,
        recipientId: post.creatorId,
        resourceId: post._id,
        resourceTitle: post.title
    });

    return res.status(200).json(
        new ApiResponse(200, {
            comment: newComment,
            commentCount: post.comments.length
        }, "Comment added successfully")
    );
});

// Get Comments for a Post
export const getComments = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const post = await Blogpost.findById(id);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const comments = post.comments || [];
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedComments = comments.slice(startIndex, endIndex);

    return res.status(200).json(
        new ApiResponse(200, {
            comments: paginatedComments,
            totalComments: comments.length,
            currentPage: page,
            totalPages: Math.ceil(comments.length / limit)
        }, "Comments fetched successfully")
    );
});

// Delete Comment
export const deleteComment = asyncHandler(async (req, res) => {
    const { id, commentIndex } = req.params;
    const { userId } = req.body;

    const post = await Blogpost.findById(id);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (!post.comments || post.comments.length <= commentIndex) {
        throw new ApiError(404, "Comment not found");
    }

    const comment = post.comments[commentIndex];
    
    // Check if user can delete this comment (only comment author or post author)
    if (comment.userId !== userId && post.creatorId.toString() !== userId) {
        throw new ApiError(403, "Not authorized to delete this comment");
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    return res.status(200).json(
        new ApiResponse(200, { commentCount: post.comments.length }, "Comment deleted successfully")
    );
});


  