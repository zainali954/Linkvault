import mongoose from "mongoose";
import slugify from "slugify";

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique:true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
     slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically generate or update slug before saving
tagSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;
