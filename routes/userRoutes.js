const express = require("express")
const userRouter = express.Router()
const userController = require("../controllers/userControllers")
const verifyToken = require("../middlewares/userAuthMiddleware")
const TryCatch = require("../middlewares/tryCatchMiddleware")



userRouter.post('/register',TryCatch(userController.createuser))
userRouter.post('/login',TryCatch(userController.userLogin))
userRouter.get('/products',verifyToken,TryCatch(userController.productList))
userRouter.get('/products/:id',verifyToken,TryCatch(userController. prooductById))
userRouter.post('/:id/cart',verifyToken,TryCatch(userController.addTocart))
userRouter.get('/:id/cart',verifyToken,TryCatch(userController.showCart))
userRouter.delete('/:id/cart',verifyToken,TryCatch(userController.deleteCart))
userRouter.post('/:id/wishlist',verifyToken,TryCatch(userController.addToWishlist))
userRouter.delete('/:id'/'deletewish',verifyToken,TryCatch(userController.deleteWishlist))
userRouter.post('/:id/payment',verifyToken, TryCatch(userController.payment))
userRouter.get('/payment/sucess', TryCatch(userController.sucess))
userRouter.get('/payment/cancel', TryCatch(userController.cancel))


module.exports =userRouter