import React, { Component } from "react";
import { connect } from "react-redux";
import { FormGroup, FormControl, Glyphicon, InputGroup } from "react-bootstrap";
import { setSearch, setSearchedRecipes } from "../actions/actions";

class Search extends Component {
  searchRecipes = () => {
    if (this.props.search !== "") {
      fetch("/search/" + this.props.search)
        .then(response => response.json())
        .then(recipes => this.props.setSearchedRecipes(recipes));
    }
  };

  render() {
    return (
      <div className="search">
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              value={this.props.search}
              placeholder="Search for recipes by title"
              onChange={e => {
                this.props.setSearch(e.target.value);
                setTimeout(() => this.searchRecipes(), 100);
              }}
            />
            <InputGroup.Addon
              onClick={() => {
                this.searchRecipes();
              }}
            >
              <Glyphicon glyph="glyphicon glyphicon-search" />
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  search: state.search,
  searchedRecipes: state.searchedRecipes
});

const mapDispatchToProps = dispatch => ({
  setSearch: e => dispatch(setSearch(e)),
  setSearchedRecipes: e => dispatch(setSearchedRecipes(e))
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
