var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var recipesSchema = Schema(
  {
    cloudinaryId: { type: String, required: false },
    title: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: Object, required: true }
  },
  {
    minimize: false
  }
);

recipesSchema.index({ title: "text" });

var Recipes = mongoose.model("Recipes", recipesSchema);

module.exports = Recipes;
