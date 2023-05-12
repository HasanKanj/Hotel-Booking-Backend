import asyncHandler from "express-async-handler";
import upload from "../utils/multer.js"; // import the multer instance
import cloudinary from "../utils/cloudinary.js";
import multer from "multer";
import Hotels from "../models/HotelModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getHotels = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Hotels.countDocuments({ ...keyword });
  const products = await Hotels.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getHotelById = asyncHandler(async (req, res) => {
  const Hotel = await Hotels.findById(req.params.id);

  if (Hotel) {
    res.json(Hotel);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a Hotel
// @route   DELETE /api/hotel/:id
// @access  Private/Admin

const deleteHotel = asyncHandler(async (req, res) => {
  const hotelid = req.params.id;

  const hotel = await Hotels.findById(hotelid);
  if (!hotel) {
    res.status(404);
    throw new Error("Car not found");
  }

  // Delete image from Cloudinary
  await cloudinary.uploader.destroy(hotel.public_id);

  // Delete car from database
  await Hotels.deleteOne({ _id: hotelid });

  res.json({ message: "Car removed" });
});


const createHotel = asyncHandler(async (req, res) => {
  upload.single("image")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log(err);
      return res.status(500).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log(err);
      return res.status(500).json({ error: err.message });
    }

    // Everything went fine.
    // Continue with your route handler.
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      // Create new Hotel
      let Hotel = new Hotels({
        city: req.body.city,
        address: req.body.address,
        distance: req.body.distance,
        features: req.body.features,
        mileage: req.body.mileage,
        price: req.body.price,
        features: req.body.features,
        description: req.body.description,
        category: req.body.category,
        title: req.body.title,
        location: req.body.location,
        guests: req.body.guests,
        cheapestPrice: req.body.cheapestPrice,
        public_id: result.public_id,
        url: result.secure_url,
      });
      
      // save Hotel details in mongodb
      await Hotel.save();
      res.status(200).json({ message: "Hotel created successfully!", Hotel });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
});

//@desc   Update a Hotel
//@route  PUT /api/Hotels/:id
//@access Private/Admin
const updateHotel = asyncHandler(async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
      } else {
        const {
          city,
          address,
          distance,
          price,
          features,
          category,
          rating,
          description,
          title,
          location,
          guests,
          cheapestPrice
        } = req.body;
        const Hotel = await Hotels.findById(req.params.id);

        if (!Hotel) {
          res.status(404);
          throw new Error("Hotel not found");
        }

        // Update Hotel properties
        Hotel.city = city || Hotel.city;
        Hotel.address = address || Hotel.address;
        Hotel.distance = distance || Hotel.distance;
        Hotel.price = price || Hotel.price;
        Hotel.features = features || Hotel.features;
        Hotel.category = category || Hotel.category;
        Hotel.rating = rating || Hotel.rating;
        Hotel.description = description || Hotel.description;
        Hotel.title = title || Hotel.title;
        Hotel.location = location || Hotel.location;
        Hotel.guests = guests || Hotel.guests;
        Hotel.cheapestPrice = cheapestPrice || Hotel.cheapestPrice;


        if (req.file) {
          // Delete old image from Cloudinary
          await cloudinary.uploader.destroy(Hotel.public_id);

          // Upload new image to Cloudinary
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "Hotels",
          });

          Hotel.public_id = result.public_id;
          Hotel.url = result.secure_url;
        }

        const updatedHotel = await Hotel.save();
        res.json(updatedHotel);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createHotelReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const Hotel = await Hotel.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopHotels = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

export {
  getHotels,
  getHotelById,
  deleteHotel,
  createHotel,
  updateHotel,
  createHotelReview,
  getTopHotels,
};
