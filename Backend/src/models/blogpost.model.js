import mongoose, {Schema} from "mongoose";

const blogPostSchema = new Schema ({
       title: {
         type: String,
         required: true
       },
       descriptions: {
         type: String,
         required: true
       },
       categorydescriptions: {
        type: String,
        required: true
       },
       creatorname: {
        type: String,
        required: true,
      },

},
   {
       timestamps: true
   }

)


export const Blogpost = mongoose.model("Blogpost", blogPostSchema)