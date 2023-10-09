const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
   name : {
    type: String,
    required: true,
   },
   email : {
    type: String,
    required: true,
   },
   username:{
      type:String,
      required:true,
   },
   password : {
    type: String,
    required: true,
   }, 
   cart:[{
    type:mongoose.Schema.ObjectId,
    ref:"product",
    required:true,
   }],
   wishlist:[{
    type:mongoose.Schema.ObjectId,
    ref:"product",
    required:true,
   }],
   orders: {
    type: Array,
    required: true,
   },

});

userSchema.pre('save',async function(next){
   try{
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password,salt);
      this.password = hashedPassword 
      next();
    
   }catch(error){
      next(error);
   }
})
module.exports=mongoose.model("user",userSchema);