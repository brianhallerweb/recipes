import React, { Component } from "react";
import { connect } from "react-redux";
import { Glyphicon, Tooltip, OverlayTrigger } from "react-bootstrap";
import { setSearch } from "../actions/actions";
import { Link } from "react-router-dom";

class SearchResults extends Component {
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

  render() {
    const tooltip = (
      <Tooltip placement="bottom" className="in" id="tooltip-bottom">
        back
      </Tooltip>
    );
    return (
      <div>
        {this.props.search ? (
          <div className="displayTitles">
            <div className="backArrow">
              <OverlayTrigger placement="bottom" overlay={tooltip}>
                <Glyphicon
                  onClick={() => this.props.setSearch("")}
                  glyph="glyphicon glyphicon-arrow-left"
                />
              </OverlayTrigger>
              <span className="arrowWords">
                Search results for: {this.props.search}
              </span>
            </div>
            {this.props.searchedRecipes.length !== 0 ? (
              <ul className="searchList">
                {this.props.searchedRecipes.map(recipe => {
                  return (
                    <Link to={`/DisplayRecipe/${recipe._id}`}>
                      <li
                        className="titles"
                        onClick={() => this.props.setSearch("")}
                      >
                        {recipe.title}
                      </li>
                    </Link>
                  );
                })}
              </ul>
            ) : (
              <p className="searchList">No recipes found</p>
            )}
          </div>
        ) : (
          <div className="intro">
            <h4>Favorites</h4>
            <ul className="recipeList">
              {this.state.recipes.map(recipe => {
                if (recipe.starSelected === true) {
                  return (
                    <Link
                      className="titles"
                      to={`/DisplayRecipe/${recipe._id}`}
                    >
                      <li>{recipe.title}</li>
                    </Link>
                  );
                }
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  search: state.reducer.search,
  searchedRecipes: state.reducer.searchedRecipes
});

const mapDispatchToProps = dispatch => ({
  setSearch: e => dispatch(setSearch(e))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
