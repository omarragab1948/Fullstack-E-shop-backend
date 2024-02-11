const { default: mongoose } = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
  },

  image: {
    type: String,
    required: [true, "Image is required"],
  },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
