const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//     cloud_name: 'dcdcmeuhe',
//     api_key: '289757566492112',
//     api_secret: 'gMcmtirQpK70rnabNVTsXH99hZw',
//     secure: true
//   });
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

//add category
exports.addCategory = catchAsyncError(async (req, res, next) => {
  console.log("Category ", req.body);
  const file = req.files.file;
  console.log(file);

  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    // if(err){
    //     console.log("Error ",err);
    // }
    console.log("XXX ", result);
    const category = new Category({
      categoryName: req.body.categoryName,
      categoryDescription: req.body.categoryDescription,
      categoryImages: {
        public_id: result.public_id,
        url: result.url,
      },
    });
    category
      .save()
      .then((createdCategory) => {
        res.status(201).json({
          message: "Category Created",
          createdCategory,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
// get all category
exports.categoryAll = catchAsyncError(async (req, res, next) => {
  const Categories = await Category.find();

  res.status(200).json({
    success: true,
    Categories,
  });
});

//update category
exports.updateCategory = catchAsyncError(async (req, res, next) => {
  console.log("updateCategory", req.params.id);
  let category = await Category.findById(req.params.id);
  console.log("Category ::", category);
  if (!category) {
    return next(new ErrorHander("Category Not Found", 404));
  }

  product = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product: product,
  });
});

//delete Category
exports.deleteCategory = catchAsyncError(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHander("Product Not Found", 404));
  }
  await category.remove();

  res.status(200).json({
    success: true,
    message: "Category Deleted Successfully",
  });
});

//get products by category
exports.categoryProducts = catchAsyncError(async (req, res, next) => {
  const Products = await Product.find({ category: req.params.id });

  res.status(200).json({
    success: true,
    Products,
  });
});
