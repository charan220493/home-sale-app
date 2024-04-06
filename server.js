// server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const PropertyListing = require('./models/propertyListing'); // Import Mongoose model

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/homeSaleApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueFilename = uuidv4();
    cb(null, uniqueFilename + '-' + file.originalname);
  },
});

const upload = multer({ storage });

app.get('/listings', async (req, res) => {
  try {
    const listings = await PropertyListing.find();
    const listingsWithImages = listings.map(listing => ({
      ...listing._doc,
      images: listing.images.map(image => `${image}`) // Replace 'your-domain.com' with your actual domain
    }));
    console.log(listingsWithImages);
    res.json(listingsWithImages);
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});


// Endpoint for submitting a new property listing with images
app.post('/listings', upload.array('images', 5), async (req, res) => {
  const { address, price, bedrooms, bathrooms, description, propertyType, propertySize, propertySizeUnit, coverImageIndex } = req.body;

  if (!address || !price || !bedrooms || !bathrooms || !description || !propertyType || !propertySize || !propertySizeUnit) {
    return res.status(400).json({ error: 'All fields, including at least one image, are required' });
  }

  const images = req.files.map(file => `uploads/${file.filename}`);

  try {
    const newListing = new PropertyListing({
      address,
      price: parseFloat(price),
      bedrooms: parseInt(bedrooms, 10),
      bathrooms: parseInt(bathrooms, 10),
      description,
      propertyType,
      propertySize,
      propertySizeUnit,
      images,
      coverImageIndex,
    });

    await newListing.save();

    res.status(201).json(newListing);
  } catch (error) {
    console.error('Error adding property listing:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
