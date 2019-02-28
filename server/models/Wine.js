const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wineSchema = new Schema({
  wineType: {
    type: String,
    required: true
  },
  averageRating:{
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  link:{
    type: String,
    required: true,
  },
  price:{
    type: String,
    required: true,
  },
  ratingCount:{
    type: Number,
    required: true,
  },
  title:{
    type: String,
    required: true,
    unique: true
  }

  });

const Wine = mongoose.model('Wine', wineSchema);
module.exports = Wine;
