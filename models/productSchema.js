const mongoose = require ("mongoose");
const productSchema = new mongoose.Schema({
    title:{
        type:String,
       
    },
    description:{
        type:String,
       
    },
    price:{
        type:Number,
       
    },
    image:{
        type:String,
      
    },
    category:{
        type:String,
        
    }
});
module.exports=mongoose.model('product',productSchema);