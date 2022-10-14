const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary").v2;


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

//create product
exports.createProduct = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  console.log("Product :: ", JSON.parse(JSON.stringify(req.body)));
  const file = req.files.file;
  console.log(file);

  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    console.log("XXX ", result);
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      Stock: req.body.stock,
      description: req.body.description,
      category: req.body.category,
      images: {
        public_id: result.public_id,
        url: result.url,
      },
    });
    product
      .save()
      .then((createdProduct) => {
        res.status(201).json({
          message: "Product Created",
          createdProduct,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

exports.getAllProducts = catchAsyncError(async (req, res) => {

  const productCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query).search();
  const products = await apiFeature.query;
  res.status(200).json({
    success: true,
    products,
    productCount,
  });
});


//update product
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  console.log("CCC  :: ", req.body);
  let product = await Product.findById(req.params.id);
  console.log("Product ::", product);

  if (!product) {
    return next(new ErrorHander("Product Not Found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product: product,
  });
});

//delete product
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product Not Found", 404));
  }
  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

//get product details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});




//create new review or update the review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// get all review of product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  console.log("Vinay");
  console.log("#### ", req.query.productId);
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  // console.log("req.query ::: ", req.query);
  // console.log("req.query.productId ::: ", req.query.productId);
  // const product=await Product.findById(req.query.productId);

  // console.log("Details :: ",product)
  // if(!product){
  //     return next(new ErrorHander("Product Not Found",404));
  // }
  // const reviews=product.reviews.filter(
  //     (rev)=>rev._id.toString() !== req.query.id.toString()
  // );

  // let avg=0;
  // reviews.forEach((rev)=>{
  //     avg+=rev.rating;
  // });
  // if (reviews.length === 0) {
  //     ratings = 0;
  //   } else {
  //     ratings = avg / reviews.length;
  //   }

  // const numOfReviews= reviews.length;

  // await Product.findByIdAndUpdate(req.query.productId,{
  //     reviews,
  //     ratings,
  //     numOfReviews,
  // },
  // {
  //     new:true,
  //     runValidators:true,
  //     useFindAndModify:false,
  // });

  // res.status(200).json({
  //     success:true,
  //     reviews:product.reviews
  // });

  console.log("req.query ::: ", req.query);
  console.log("req.query.productId ::: ", req.query.productId);

  const product = await Product.findById(req.query.productId);
  console.log("product ::", product);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  console.log("reviews ::", reviews);
  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  console.log("reviews length ::", ratings);
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    }
    //   {
    //     new: true,
    //     runValidators: true,
    //     useFindAndModify: false,
    //   }
  );

  res.status(200).json({
    success: true,
  });
});
