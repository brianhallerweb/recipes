import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class DisplayTitles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: []
    };
  }

  componentDidMount() {
    fetch("/recipes/")
      .then(response => response.json())
      .then(recipes => this.setState({ recipes: recipes }));
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    return (
      <div className="displayTitles">
        <h4>{this.capitalizeFirstLetter(this.props.category)} Recipes</h4>
        <ul className="recipeList">
          {this.state.recipes.map(recipe => {
            if (this.props.category === "all") {
              return (
                <Link to={`/DisplayRecipe/${recipe._id}`}>
                  <li className="titles">{recipe.title}</li>
                </Link>
              );
            } else if (recipe.category === this.props.category) {
              return (
                <Link className="titles" to={`/DisplayRecipe/${recipe._id}`}>
                  <li>{recipe.title}</li>
                </Link>
              );
            }
          })}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  category: state.category
});

export default connect(mapStateToProps)(DisplayTitles);
