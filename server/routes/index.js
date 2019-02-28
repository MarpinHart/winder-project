const express = require('express');
const router = express.Router();
const Food = require('../models/Food')
const Wine = require('../models/Wine')

router.post('/foods', (req, res, next) => {
  Food.findOne({name: req.body.name})
    .then(res => {
      if(res === null)
        Food.create(req.body)
          .then(res => res)
          .catch(err => next)
    })
  })

router.post('/wines', (req,res,next) => {
  req.body.arrayWine.forEach(wine=>wine.price=parseFloat(wine.price.replace('$','')))
 
  Wine.create(req.body.arrayWine)
    .then(res => {
      
      
    return res })
    .catch(err => next)
})

router.get('/wines', (req,res,next)=>{
  console.log('req.query',req.query)
  Wine.find({$and:[{price:{$lte:req.query.maxPrice}},
    {averageRating:{$gte:req.query.minRating}},
    {wineType:req.query.wine}]}).limit(3)

  .then(wines=>{
    console.log('res in wines get', res)
return res.json(wines)

  }
    )
  .catch(err=>console.log(err))
})

module.exports = router;
