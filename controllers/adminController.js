const mongoose = require("mongoose");
const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const jwt = require("jsonwebtoken");

mongoose.connect("mongodb://0.0.0.0:27017/E-commerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  loginAdmin: async (req, res) => {
    const { username, password } = req.body;
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { username: username },
        process.env.ADMIN_ACCESS_TOKEN_SECRET
      );
      res.status(200).json({
        status: "success",
        message: "sucessfully logged in",
        data: { jwt_token: token },
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "ur not admin",
      });
    }
  },

  getAllusers: async (req, res) => {
    const allusers = await User.find();
    res.status(200).json({
      status: "success",
      message: "successfully fetched user data",
      data: allusers,
    });
  },
  getUserByid: async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.status(200).json({
      status: "success",
      message: "successfully fetched user data",
      data: user,
    });
  },
  getAllProducts: async (req, res) => {
    const allproducts = await Product.find();
    res.status(200).json({
      status: "success",
      message: "successfully fetched",
      data: allproducts,
    });
  },
  createProduct: async (req, res) => {
    const { title, description, image, price, category } = req.body;

    const products = await Product.create({
      title,
      description,
      price,
      image,
      category,
    });

    if (!products) {
      return res.status(404).json({ error: "products not created" });
    }

    res.status(201).json({
      status: "success",
      message: "Successfully created a product.",
    });
  },
  viewProductById: async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }
    res.status(200).json({
      status: "success",
      message: "successfully fetched product data",
      data: product,
    });
  },
  deleteProduct: async (req, res) => {
    const { id } = req.body;
    await Product.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",
      message: "successfully deleted product",
    });
  },
  updateProduct: async (req, res) => {
    const { title, description, image, price, category, id } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "product not updated" });
    }
    await Product.updateOne(
      { _id: id },
      {
        $set: {
          title: title,
          description: description,
          price: price,
          image: image,
          category: category,
        },
      }
    );
    res.status(200).json({
      status: "success",
      message: "product is successfully updated",
     
    });
  },
  stats: async (req, res) => {
    const aggregation = User.aggregate([
      {
        $unwind: "$orders",
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$orders.totalamount" },
          totalItemsSsold: { $sum: { $size: "$orders.product" } },
        },
      },
    ]);
    const result = await aggregation.exec();
    const totalRevenue = result[0].totalRevenue;
    const totalItemsSsold = result[0].totalItemsSsold;
    res.status(200).json({
      status: "success",
      message: "successfully fetched stats",
      data: {
        "total Revenue": totalRevenue,
        "total Items Sold": totalItemsSsold,
      },
    });
  },
  orders: async (req, res) => {
    const order = await User.find({ orders: { $exists: true } }, { orders: 1 });
    const orders = order.filter((item) => {
      return item.orders.length > 0;
    });
    res.status(200).json({
      status: "success",
      message: "successfully fetched orders",
      data: orders,
    });
  },
};
