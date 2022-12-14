const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please Enter Product Description"]
    },
    price:{
        type:Number,
        maxLength:[8,"Price cannot exceed 8 characters"],
        required:[true,"Please Enetr Product Price"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        },
    category:{
        type:String, //mongoose.Schema.ObjectId,
     //   ref:'Category',
     //   required:[true,"Please Enter/Select Category Name/Id"]
    },
    Stock:{
        type:Number,
        required:[true,"Please Enter Product Stock"],
        maxLength:[4,"Stock cannot exceed 4 characters"],
        default:1
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            Comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
     //   required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports=mongoose.model("Product",productSchema)