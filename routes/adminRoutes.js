const express=require('express')
const adminRouter=express.Router()
const adminControllers=require("../controllers/adminController")
const verifyToken=require("../middlewares/adminAuthMiddleware")
const TryCatch=require("../middlewares/tryCatchMiddleware")
const upload= require("../middlewares/photoUpload") 


adminRouter.use(express.json())

adminRouter.post('/login',TryCatch(adminControllers.loginAdmin))
adminRouter.get('/users',verifyToken,TryCatch(adminControllers.getAllusers))
adminRouter.get('/users/:id',verifyToken,TryCatch(adminControllers.getUserByid))
adminRouter.post('/products',verifyToken,upload,TryCatch(adminControllers.createProduct))
adminRouter.get('/products/',verifyToken,TryCatch(adminControllers.getAllProducts))
adminRouter.get('/viewproduct/:id',verifyToken,TryCatch(adminControllers.viewProductById))
adminRouter.delete('/products',verifyToken,TryCatch(adminControllers.deleteProduct))
adminRouter.put('/update',verifyToken,TryCatch(adminControllers.updateProduct))
adminRouter.get('/orders',verifyToken,TryCatch(adminControllers.orders))
adminRouter.get('/stats',verifyToken,TryCatch(adminControllers.stats))



module.exports=adminRouter