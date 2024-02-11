const { default: mongoose } = require("mongoose");
const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  colors: [
    {
      name: String,
    },
  ],
  specifications: [
    {
      name: String,
      value: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
