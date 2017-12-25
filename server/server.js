var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Recipes = require("../models/recipes");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/recipes");

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
  Recipes.remove({ _id: req.params.id }, function(err, result) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

app.put("/editrecipes/:id", function(req, res) {
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

app.listen(process.env.PORT || 3001);
