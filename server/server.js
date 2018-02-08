var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Recipes = require("../models/recipes");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/recipes");
const path = require("path");

app.use(bodyParser.json());

app.get("/recipes", function(req, res) {
  Recipes.find(function(err, recipes) {
    res.json(recipes);
  });
});

app.get("/recipes/:id", function(req, res) {
  Recipes.findOne({ _id: req.params.id }, function(err, recipe) {
    res.json(recipe);
  });
});

app.get("/search/:searchString", function(req, res) {
  Recipes.find({
    $text: { $search: req.params.searchString }
  }).exec(function(err, recipes) {
    res.json(recipes);
  });
});

app.post("/recipes", function(req, res) {
  var newRecipe = new Recipes({
    cloudinaryId: req.body.cloudinaryId,
    title: req.body.title,
    category: req.body.category,
    content: req.body.contentState
  });
  newRecipe.save(function(err, result) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

app.delete("/deleterecipes/:id", function(req, res) {
  cloudinary.v2.uploader.destroy(req.body.cloudinary_id, function(
    error,
    result
  ) {
    Recipes.remove({ _id: req.params.id }, function(err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(result);
      }
    });
  });
});

app.put("/editrecipes/:id", function(req, res) {
  cloudinary.v2.uploader.destroy(req.body.cloudinaryIdDelete, function(
    error,
    result
  ) {
    Recipes.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: req.body
      },
      { new: true },
      function(err, result) {
        if (err) {
          res.status(500).json(err);
        } else {
          res.json(result);
        }
      }
    );
  });
});

app.put("/star/:id", function(req, res) {
  Recipes.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body
    },
    { new: true },
    function(err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(result);
      }
    }
  );
});

app.use(express.static("build"));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../build/index.html"))
);

app.listen(process.env.PORT || 3001);
