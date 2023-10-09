const mongoose = require("mongoose");
const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.PAYMENT_KEY);
require("dotenv").config();
const { authSchema } = require("../models/validationSchema");
mongoose.connect("mongodb://0.0.0.0:27017/E-commerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let temp

module.exports = {
  createuser: async (req, res) => {
    const { value, error } = authSchema.validate(req.body);
    if (error) {
      res.json(error.message);
    }
    const { name, email, username, password } = value;
    await User.create({
      name: name,
      email: email,
      username: username,
      password: password,
    });

    res.status(200).json({
      status: "success",
      message: "user registration successfull.",
    });
  },
  userLogin: async (req, res) => {
    const { value, error } = authSchema.validate(req.body);
    if (error) {
      res.json(error.message);
    }
    const { username, password } = value;
    const user = User.findOne({ username: username, password: password });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const token = jwt.sign(
      { username: user.username },
      process.env.USER_ACCESS_TOKEN_SECRET
    );
    res
      .status(200)
      .json({ status: "success", message: "login successfull", data: token });
  },

  productList: async (req, res) => {
    const productList = await Product.find();
    res.status(200).json({
      status: "success",
      message: "successfully fetched product data",
      data: productList,
    });
  },

  prooductById: async (req, res) => {
    const id = req.params.id;
    const productById = await Product.findById(id);
    if (!productById) {
      return res.status(404).json({ error: "product not found" });
    }

    res.status(200).json({
      status: "success",
      message: "successfully fetched product details",
      data: productById,
    });
  },


  addTocart: async (req, res) => {
    const userId = req.params.id;
    const productId = req.body.productId;
    await User.updateOne({ _id: userId }, { $push: { cart: productId } });
    res.status(200).json({
      status: "success",
      message: "successfully added product to cart.",
    });
  },

  deleteCart: async (req, res) => {
    const userId = req.params.id;
    const productId = req.body.productId;

    await User.updateOne({ _id: userId }, { $pull: { cart: productId } });
    res.status(200).json({
      status: "success",
      message: "successfully deleted product from cart",
    });
  },

  showCart: async (req, res) => {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId }).populate("cart");
    if (!user) {
      return res.status(404).json({ error: "nothing to show on cart" });
    }
    res.status(200).json({
      status: "success",
      message: "successfully fetched cart details",
      data: user.cart,
    });
  },

  addToWishlist: async (req, res) => {
    const userId = req.params.id;
    const productId = req.body.productId;
    await User.updateOne(
      { _id: userId },
      { $addToSet: { wishlist: productId } }
    );
    res.status(200).json({
      status: "success",
      message: "successfully added product to wishlist",
    });
  },

  deleteWishlist: async (req, res) => {
    const userId = req.params.id;
    const productId = req.body.productId;
    await User.updateOne({ _id: userId }, { $pull: { wishlist: productId } });
    res.status(200).json({
      status: "success",
      message: "successfully deleted product from wishlist",
    });
  },
  payment: async (req, res) => {
    const user = await User.find({ _id: req.params.id }).populate("cart");
    console.log(user)


    const cartitem = user[0].cart.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.description,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      };
    });
    console.log(cartitem);
    if (cartitem.length > 0) {
      const session = await stripe.checkout.sessions.create({
        line_items: cartitem,
        mode: "payment",
        success_url: "http://127.0.0.1:5000/api/user/payment/sucess",
        cancel_url: "http://127.0.0.1:5000/api/user/payment/cancel",
      });
      temp = {
        cartitem: user[0].cart.map((item) => item._id),
        id: req.params.id,
        paymentid: session.id,
        amount: session.amount_total / 100,
      };
      res.send({ url: session.url });
    } else {
      res.send("user no cart item found");
    }
  },
  sucess: async (req, res) => {
    console.log(temp);
    const user = await User.find({ _id: temp.id });
    if (user.length != 0) {
      await User.updateOne(
        { _id: temp.id },
        {
          $push: {
            orders: {
              product: temp.cartitem,
              date: new Date(),
              orderid: Math.random(),
              paymentid: temp.paymentid,
              totalamount: temp.amount,
            },
          },
        }
      );
      await User.updateOne({ _id: temp.id }, { cart: [] });
    }
      res.status(200).json({
        status: "success",
        message: "successfully added in order",
  
      });
    },
  cancel: async (req, res) => {
    console.log(temp);
    const user = await User.findOne({ _id: temp.id });
    if (user.length != 0) {
      await User.updateOne(
        { _id: temp.id },
        {
          $push: {
            orders: {
              product: temp.cartitem,
              date: new Date(),
              orderid: Math.random(),
              paymentid: temp.paymentid,
              amount: temp.amount,
            },
          },
        }
      );
      await User.updateOne({ _id: temp.id }, { cart: [] });
    }
    res.status(200).json({
      status: "success",
      message: "successfully added in order",
    });
  },
  cancel: async (req, res) => {
    res.json("canceled");
  },
};
