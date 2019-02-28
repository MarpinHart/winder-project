const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wineSchema = new Schema({
  wineType: {
    type: String,
    required: true
  },
  averageRating:{
    type: Number,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  link:{
    type: String,
  },
  price:{
    type: String,
  },
  ratingCount:{
    type: Number,
  },
  title:{
    type: String,
    required: true,
    unique: true
  }

  });

const Wine = mongoose.model('Wine', wineSchema);
module.exports = Wine;
