import asyncHandler from "express-async-handler";
import upload from "../utils/multer.js"; // import the multer instance
import cloudinary from "../utils/cloudinary.js";
import multer from "multer";
import Hotels from "../models/HotelModel.js";
import Room from "../models/RoomModel.js";
// @desc    Fetch all Hotels
// @route   GET /api/Hotels
// @access  Public
const getHotels = async (req, res, next) => {
  const { min, max, ...others } = req.query;
  const { city } = others;
  
  try {
    const hotels = await Hotels.find({
      ...others,
      city: { $regex: new RegExp(city, "i") },
      cheapestPrice: { $gt: min | 1, $lt: max || 999 },
    }).limit(req.query.limit);
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};


// @desc    Fetch Hotel by city
// @route   GET /api/hotels/:id
// @access  Public
const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotels.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a Hotel
// @route   DELETE /api/hotel/:id
// @access  Private/Admin

const deleteHotel = asyncHandler(async (req, res) => {
  const hotelid = req.params.id;

  const hotel = await Hotels.findById(hotelid);
  if (!hotel) {
    res.status(404);
    throw new Error("Hotel not found");
  }

  // Delete image from Cloudinary
  await cloudinary.uploader.destroy(hotel.public_id);

  // Delete Hotel from database
  await Hotels.deleteOne({ _id: hotelid });

  res.json({ message: "Hotel removed" });
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
        name: req.body.name,
        city: req.body.city,
        type: req.body.type,
        rating:req.body.rating,
        address: req.body.address,
        distance: req.body.distance,
        features: req.body.features,
        price: req.body.price,
        features: req.body.features,
        description: req.body.description,
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
          name,
          city,
          address,
          distance,
          price,
          features,
          rating,
          description,
          title,
          location,
          guests,
          cheapestPrice,
        } = req.body;
        const Hotel = await Hotels.findById(req.params.id);

        if (!Hotel) {
          res.status(404);
          throw new Error("Hotel not found");
        }

        // Update Hotel properties
        Hotel.name = name || Hotel.name;
        Hotel.city = city || Hotel.city;
        Hotel.address = address || Hotel.address;
        Hotel.distance = distance || Hotel.distance;
        Hotel.price = price || Hotel.price;
        Hotel.features = features || Hotel.features;
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
// @route   POST /api/hotels/:id/reviews
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

// @desc    Get top rated hotels
// @route   GET /api/hotels/top
// @access  Public
const getTopHotels = asyncHandler(async (req, res) => {
  const hotels = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(hotels);
});

// Controller function for counting hotels by city
const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotels.countDocuments({ city: { $regex: new RegExp(city, "i") } });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

 const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotels.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotels.countDocuments({ type: "apartment" });
    const resortCount = await Hotels.countDocuments({ type: "resort" });
    const villaCount = await Hotels.countDocuments({ type: "villa" });
    const cabinCount = await Hotels.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};



const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotels.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

 const getHotelRoomCount = async (req, res, next) => {
  try {
    const hotel = await Hotels.findById(req.params.id);
    const count = hotel.rooms.length;
    res.status(200).json({ count });
  } catch (err) {
    next(err);
  }
};


export {
  getHotels,
  getHotel,
  deleteHotel,
  createHotel,
  updateHotel,
  createHotelReview,
  getTopHotels,
  countByCity,
  countByType,
  getHotelRooms,
  getHotelRoomCount
};
