const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const Wine = require("../models/Wine");
const SavedWine = require("../models/SavedWine");

//POST foods to the database
router.post("/foods", (req, res, next) => {
  Food.findOne({ name: req.body.name }).then(res => {
    if (res === null)
      Food.create(req.body)
        .then(food => res.json(food))
        .catch(err => next);
  });
});

// POST wines to the database
router.post("/wines", (req, res, next) => {
  //transform price in number
  req.body.arrayWine.forEach(
    wine => (wine.price = parseFloat(wine.price.replace("$", "")))
  );
  Wine.create(req.body.arrayWine)
    .then(wines => res.json(wines))
    .catch(err => console.log(err));
});

//GET wines details
router.get("/wines", (req, res, next) => {
  Wine.find({
    $and: [
      { price: { $lte: req.query.maxPrice } },
      { averageRating: { $gte: req.query.minRating } },
      { wineType: req.query.wine }
    ]
  })
    .limit(3)
    .then(wines => res.json(wines))
    .catch(err => console.log(err));
});

//GET food and send back the three types of wine
router.get("/foods", (req, res, next) => {
  if(req.query.allfoods){
    Food.find()
    .then(food => res.json(food.map(food=>food.name)))
    .catch(err => console.log(err));

  } else{
Food.findOne({ name: req.query.name })
    .then(food => res.json(food))
    .catch(err => console.log(err));
  }
  
});



router.post("/saved-wines", (req, res, next) => {
  const _wine = req.body._wine;
  const _user = req.user._id;
  SavedWine.create({ _wine, _user })
    .then(savedWine => res.json(savedWine))
    .catch(err => console.log(err));

});

router.get("/saved-wines",(req, res, next)=>{
  console.log("user", req.user)
  SavedWine.find({_user:req.user._id})
  .populate('_wine')
  .then(savedWines=>{
    let savedWinesQuery=savedWines
    if(req.query.getOnlyId){
      savedWinesQuery=savedWinesQuery.map(s=>s._wine._id)
    }
   return res.json(savedWinesQuery)})
  .catch(err=>console.log(err))
})

router.delete("/saved-wines",(req, res, next)=>{
  SavedWine.findOneAndDelete({_user:req.user._id},{_wine:req.body._wine})
  .then(deleteSave=>res.json(deleteSave))
  .catch(err=>console.log(err))
})

//PUT rating wine saved by user
router.put('/saved-wines',(req, res, next)=>{
  SavedWine.findByIdAndUpdate(
     req.body.idSaving,
     { rating: req.body.rating},
     {new: true})
    .then((savedWine) => {
      res.json(savedWine)
    })
    .catch(err=>console.log(err))
})
module.exports = router;
