const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const Wine = require("../models/Wine");
const SavedWine = require("../models/SavedWine");
const {isLoggedIn} = require('../middlewares')

//GET food and send back the three types of wine
router.get("/foods", (req, res, next) => {
  Food.find()
  .then(food => res.json(food.map(food=>food.name)))
  .catch(err => console.log(err));
});

router.get("/foods/:name", (req, res, next) => {
  Food.findOne({ name: req.params.name })
    .then(food => res.json(food))
    .catch(err => console.log(err));
});

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
    price: { $lte: req.query.maxPrice },
    averageRating: { $gte: req.query.minRating },
    wineType: req.query.wine
  })
    .sort({averageRating: -1})
    .limit(3)
    .then(wines => res.json(wines))
    .catch(err => console.log(err));
});



router.post("/saved-wines", isLoggedIn, (req, res, next) => {
  const _wine = req.body._wine;
  const _user = req.user._id;
  SavedWine.create({ _wine, _user })
    .then(savedWine => res.json(savedWine))
    .catch(err => console.log(err));

});

router.get("/saved-wines", isLoggedIn,(req, res, next)=>{
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

router.delete("/saved-wines", isLoggedIn,(req, res, next)=>{
  SavedWine.findOneAndDelete({_user:req.user._id},{_wine:req.body._wine})
  .then(deleteSave=>res.json(deleteSave))
  .catch(err=>console.log(err))
})

//PUT rating wine saved by user
router.put('/saved-wines',(req, res, next)=>{
  let trilean=null
  if(req.body.type==="like"){
    trilean = true
  }
  if(req.body.type==="dislike"){
    trilean = false
  }
  SavedWine.findByIdAndUpdate(
     req.body.idSaving,
     { isLiked: trilean},
     {new: true})
    .then((savedWine) => {
      res.json(savedWine)
    })
    .catch(err=>console.log(err))
})
module.exports = router;
