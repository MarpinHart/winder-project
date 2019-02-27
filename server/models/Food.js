const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodSchema = new Schema({
  name:{
    type: String,
    required: true,
  },
  pairedWines: {
    type: [String],
    required: true,
  },
  pairingText: String
  });

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;
