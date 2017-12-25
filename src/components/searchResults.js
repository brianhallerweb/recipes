import React, { Component } from "react";
import { connect } from "react-redux";
import { Glyphicon, Tooltip, OverlayTrigger } from "react-bootstrap";
import { setSearch } from "../actions/actions";
import { Link } from "react-router-dom";

class SearchResults extends Component {
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
          </div>
        ) : (
          <div className="intro">
            <h4>Welcome to the Haller Family Recipes database</h4>
            <p>
              Choose a category from the menu to get started, or use the search
              box above to find recipes by titles.
            </p>
            <p>
              Friends and family are welcome to contribute by adding recipes. I
              would like for this to be a place where we all keep and share our
              favorite recipes.
            </p>
            <p>
              Created by{" "}
              <a href="https://www.brianhallerweb.com">Brian Haller</a>
            </p>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  search: state.search,
  searchedRecipes: state.searchedRecipes
});

const mapDispatchToProps = dispatch => ({
  setSearch: e => dispatch(setSearch(e))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
