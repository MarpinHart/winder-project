const express = require('express');
const router = express.Router();
const Food = require('../models/Food')
const Wine = require('../models/Wine')

//POST foods to the database
router.post('/foods', (req, res, next) => {
  Food.findOne({name: req.body.name})
    .then(res => {
      if(res === null)
        Food.create(req.body)
          .then(food => res.json(food))
          .catch(err => next)
    })
  })

// POST wines to the database
router.post('/wines', (req,res,next) => {
  //transform price in number
  req.body.arrayWine.forEach(wine=>wine.price=parseFloat(wine.price.replace('$','')))
  Wine.create(req.body.arrayWine)
    .then(wines => res.json(wines))
    .catch(err => next)
})

//GET wines details
router.get('/wines', (req,res,next)=>{
  
  Wine.find({$and:[
    {price:{$lte:req.query.maxPrice}},
    {averageRating:{$gte:req.query.minRating}},
    {wineType:req.query.wine}]})
    .limit(3)
    .then(wines=>res.json(wines))
    .catch(err=>console.log(err))
})

//GET food and send back the three types of wine
router.get('/foods', (req, res, next) => {
  Food.findOne({name: req.query.name})
  .then(food => res.json(food))
  .catch(err => console.log(err))
    
  })

module.exports = router;
