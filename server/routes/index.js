const express = require('express');
const { isLoggedIn } = require('../middlewares')
const router = express.Router();
const Food = require('../models/Food')

router.post('/foods', (req, res, next) => {
  console.log('reqbody',req.body)
  Food.create(req.body)
    .then(res => {
      console.log("We love food", res)
    return res })
})

module.exports = router;
