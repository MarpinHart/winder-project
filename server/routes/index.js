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
  Wine.create(req.body.arrayWine)
    .then(res => {
      console.log("We love wine", res)
    return res })
    .catch(err => next)
})

module.exports = router;
