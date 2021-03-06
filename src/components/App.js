import React, { Component } from "react";
import "./App.css";
import DisplayRecipe from "./DisplayRecipe";
import DisplayTitles from "./DisplayTitles";
import Error from "./errorModal";
import Success from "./successModal";
import SearchResults from "./searchResults";
import Search from "./search";
import { Route, Link } from "react-router-dom";
import { ConnectedRouter as Router } from "react-router-redux";
import { history } from "../store";
import {
  Button,
  Modal,
  FormGroup,
  FormControl,
  ControlLabel,
  Glyphicon
} from "react-bootstrap";
import { connect } from "react-redux";
import {
  setCategory,
  setSearch,
  addErrorMessage,
  addSuccessMessage
} from "../actions/actions";
import "whatwg-fetch";
import { convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Dropzone from "react-dropzone";
import request from "superagent";

const content = {
  entityMap: {},
  blocks: [
    {
      key: "637gr",
      text: "Initialized from content state.",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    }
  ]
};

const CLOUDINARY_UPLOAD_PRESET = "exabyfdn";
const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/brianhallerweb/upload";

class App extends Component {
  constructor(props) {
    super(props);
    const contentState = convertFromRaw(content);
    this.initialContentState = contentState;
    this.state = {
      showModal: false,
      showDropdown: false,
      inFocus: false,
      searchTerm: "",
      title: "",
      category: "",
      myImage: "",
      contentState
    };
  }

  onContentStateChange: Function = contentState => {
    this.setState({
      contentState
    });
  };

  postRecipe = () => {
    let upload = request
      .post(CLOUDINARY_UPLOAD_URL)
      .field("upload_preset", CLOUDINARY_UPLOAD_PRESET)
      .field("file", this.state.myImage);

    upload.end((err, response) => {
      if (err) {
        this.props.addErrorMessage(
          "Your picture failed to save. Make sure your picture is a jpg or png."
        );
      }

      if (response.body.secure_url !== "") {
        fetch("/recipes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            cloudinaryId: response.body.public_id,
            title: this.state.title,
            category: this.state.category,
            contentState: this.state.contentState
          })
        }).then(response => {
          if (response.status === 500) {
            this.props.addErrorMessage(
              "Your recipe failed to save. Make sure you have included a title, category, and instructions (picture is optional)."
            );
          } else if (response.status === 200) {
            this.props.addSuccessMessage("Your recipe saved successfully.");
          }

          this.setState({
            showModal: false,
            title: "",
            category: "",
            search: "",
            myImage: "",
            contentState: ""
          });
        });
      }
    });
  };

  onDrop(accepted, rejected) {
    if (rejected.length !== 0) {
      this.props.addErrorMessage("Your picture must be a jpg or png");
    }

    this.setState({
      myImage: accepted[0]
    });
  }

  render() {
    return (
      <Router history={history}>
        <div className="mainSec">
          <nav>
            <div className="brand">
              <Link
                to="/"
                onClick={() => {
                  this.props.setCategory("");
                  this.props.setSearch("");
                }}
                style={{ textDecoration: "none" }}
              >
                <h4>Haller Family Recipes</h4>
              </Link>
            </div>
            <div
              className="dropdown"
              onClick={() =>
                this.setState({ showDropdown: !this.state.showDropdown })
              }
            >
              <span>
                <Glyphicon
                  className="hamburger"
                  glyph="glyphicon glyphicon-menu-hamburger"
                />
              </span>
              <div
                className={
                  this.state.showDropdown === true
                    ? "dropdownContentActive"
                    : "dropdownContentHidden"
                }
              >
                <Link
                  to="/DisplayRecipes"
                  className={
                    this.props.category === "salad" ? "navbtnActive" : "navbtn"
                  }
                  onClick={() => {
                    this.props.setCategory("salad");
                    this.props.setSearch("");
                    this.setState({ showDropdown: !this.state.showDropdown });
                  }}
                  style={{ textDecoration: "none", color: "#7c1b51" }}
                >
                  Salads
                </Link>
                <Link
                  to="/DisplayRecipes"
                  className={
                    this.props.category === "soup" ? "navbtnActive" : "navbtn"
                  }
                  onClick={() => {
                    this.props.setCategory("soup");
                    this.props.setSearch("");
                    this.setState({ showDropdown: !this.state.showDropdown });
                  }}
                  style={{ textDecoration: "none", color: "#7c1b51" }}
                >
                  Soups
                </Link>
                <Link
                  to="/DisplayRecipes"
                  className={
                    this.props.category === "main" ? "navbtnActive" : "navbtn"
                  }
                  onClick={() => {
                    this.props.setCategory("main");
                    this.props.setSearch("");
                    this.setState({ showDropdown: !this.state.showDropdown });
                  }}
                  style={{ textDecoration: "none", color: "#7c1b51" }}
                >
                  Main
                </Link>
                <Link
                  to="/DisplayRecipes"
                  className={
                    this.props.category === "side" ? "navbtnActive" : "navbtn"
                  }
                  onClick={() => {
                    this.props.setCategory("side");
                    this.props.setSearch("");
                    this.setState({ showDropdown: !this.state.showDropdown });
                  }}
                  style={{ textDecoration: "none", color: "#7c1b51" }}
                >
                  Sides
                </Link>
                <Link
                  to="/DisplayRecipes"
                  className={
                    this.props.category === "drink" ? "navbtnActive" : "navbtn"
                  }
                  onClick={() => {
                    this.props.setCategory("drink");
                    this.props.setSearch("");
                    this.setState({ showDropdown: !this.state.showDropdown });
                  }}
                  style={{ textDecoration: "none", color: "#7c1b51" }}
                >
                  Drinks
                </Link>
                <Link
                  to="/DisplayRecipes"
                  className={
                    this.props.category === "dessert"
                      ? "navbtnActive"
                      : "navbtn"
                  }
                  onClick={() => {
                    this.props.setCategory("dessert");
                    this.props.setSearch("");
                    this.setState({ showDropdown: !this.state.showDropdown });
                  }}
                  style={{ textDecoration: "none", color: "#7c1b51" }}
                >
                  Desserts
                </Link>
                <Link
                  to="/DisplayRecipes"
                  className={
                    this.props.category === "misc" ? "navbtnActive" : "navbtn"
                  }
                  onClick={() => {
                    this.props.setCategory("misc");
                    this.props.setSearch("");
                    this.setState({ showDropdown: !this.state.showDropdown });
                  }}
                  style={{ textDecoration: "none", color: "#7c1b51" }}
                >
                  Misc
                </Link>
                <Link
                  to="/DisplayRecipes"
                  className={
                    this.props.category === "all" ? "navbtnActive" : "navbtn"
                  }
                  onClick={() => {
                    this.props.setCategory("all");
                    this.props.setSearch("");
                    this.setState({ showDropdown: !this.state.showDropdown });
                  }}
                  style={{ textDecoration: "none", color: "#7c1b51" }}
                >
                  All
                </Link>
                <hr />
                <div className="newMobile">
                  <a
                    className={
                      this.state.showModal === true
                        ? "newrecipebtnActive"
                        : "newrecipebtn"
                    }
                    onClick={() => {
                      this.setState({ showModal: true });
                      this.props.setSearch("");
                      this.setState({ showDropdown: !this.state.showDropdown });
                    }}
                  >
                    Create new recipe
                  </a>
                </div>
              </div>
            </div>
            <div className="categories">
              <Link
                to="/DisplayRecipes"
                className={
                  this.props.category === "salad" ? "navbtnActive" : "navbtn"
                }
                onClick={() => {
                  this.props.setCategory("salad");
                  this.props.setSearch("");
                }}
                style={{ textDecoration: "none", color: "#7c1b51" }}
              >
                Salads
              </Link>
              <Link
                to="/DisplayRecipes"
                className={
                  this.props.category === "soup" ? "navbtnActive" : "navbtn"
                }
                onClick={() => {
                  this.props.setCategory("soup");
                  this.props.setSearch("");
                }}
                style={{ textDecoration: "none", color: "#7c1b51" }}
              >
                Soups
              </Link>
              <Link
                to="/DisplayRecipes"
                className={
                  this.props.category === "main" ? "navbtnActive" : "navbtn"
                }
                onClick={() => {
                  this.props.setCategory("main");
                  this.props.setSearch("");
                }}
                style={{ textDecoration: "none", color: "#7c1b51" }}
              >
                Main
              </Link>
              <Link
                to="/DisplayRecipes"
                className={
                  this.props.category === "side" ? "navbtnActive" : "navbtn"
                }
                onClick={() => {
                  this.props.setCategory("side");
                  this.props.setSearch("");
                }}
                style={{ textDecoration: "none", color: "#7c1b51" }}
              >
                Sides
              </Link>
              <Link
                to="/DisplayRecipes"
                className={
                  this.props.category === "drink" ? "navbtnActive" : "navbtn"
                }
                onClick={() => {
                  this.props.setCategory("drink");
                  this.props.setSearch("");
                }}
                style={{ textDecoration: "none", color: "#7c1b51" }}
              >
                Drinks
              </Link>
              <Link
                to="/DisplayRecipes"
                className={
                  this.props.category === "dessert" ? "navbtnActive" : "navbtn"
                }
                onClick={() => {
                  this.props.setCategory("dessert");
                  this.props.setSearch("");
                }}
                style={{ textDecoration: "none", color: "#7c1b51" }}
              >
                Desserts
              </Link>
              <Link
                to="/DisplayRecipes"
                className={
                  this.props.category === "misc" ? "navbtnActive" : "navbtn"
                }
                onClick={() => {
                  this.props.setCategory("misc");
                  this.props.setSearch("");
                }}
                style={{ textDecoration: "none", color: "#7c1b51" }}
              >
                Misc
              </Link>
              <Link
                to="/DisplayRecipes"
                className={
                  this.props.category === "all" ? "navbtnActive" : "navbtn"
                }
                onClick={() => {
                  this.props.setCategory("all");
                  this.props.setSearch("");
                }}
                style={{ textDecoration: "none", color: "#7c1b51" }}
              >
                All
              </Link>
            </div>

            <div className="new">
              <a
                className={
                  this.state.showModal === true
                    ? "newrecipebtnActive"
                    : "newrecipebtn"
                }
                onClick={() => this.setState({ showModal: true })}
              >
                Create new recipe
              </a>
            </div>
            <div className="extraBackground" />
          </nav>

          <main>
            <aside>
              <Search />
            </aside>
            <section>
              <Route exact path="/" component={SearchResults} />
              <Route
                path="/DisplayRecipes"
                component={
                  this.props.search === "" ? DisplayTitles : SearchResults
                }
              />
              <Route
                path="/DisplayRecipe/:id"
                component={
                  this.props.search === "" ? DisplayRecipe : SearchResults
                }
              />
            </section>
          </main>

          <Modal dialogClassName="adModal" show={this.state.showModal}>
            <Modal.Body>
              <div className="modalBody">
                <form>
                  <FormGroup>
                    <ControlLabel className="titleLabel">Title</ControlLabel>
                    <FormControl
                      type="text"
                      placeholder="Recipe Title"
                      onChange={e => this.setState({ title: e.target.value })}
                    />
                  </FormGroup>

                  <FormGroup controlId="formControlsSelect">
                    <ControlLabel className="categoryLabel">
                      Category
                    </ControlLabel>
                    <FormControl
                      componentClass="select"
                      onChange={e => {
                        this.setState({
                          category: e.target.value
                        });
                      }}
                    >
                      <option value="">Select</option>
                      <option value="salad">Salad</option>,
                      <option value="soup">Soup</option>,
                      <option value="main">Main</option>,
                      <option value="side">Side</option>,
                      <option value="drink">Drink</option>
                      <option value="dessert">Dessert</option>
                      <option value="misc">Misc</option>
                    </FormControl>
                  </FormGroup>

                  <FormGroup>
                    <ControlLabel className="instructionsLabel">
                      Instructions
                    </ControlLabel>
                    <Editor
                      editorClassName={
                        this.state.inFocus
                          ? "targetEditorFocus"
                          : "targetEditor"
                      }
                      toolbarHidden={true}
                      onContentStateChange={this.onContentStateChange}
                      placeholder={"Recipe Instructions"}
                      spellCheck={true}
                      onFocus={() => this.setState({ inFocus: true })}
                      onBlur={() => this.setState({ inFocus: false })}
                      toolbar={{
                        options: []
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Picture</ControlLabel>
                    <Dropzone
                      onDrop={this.onDrop.bind(this)}
                      accept="image/jpeg, image/png"
                      style={{
                        borderStyle: "dashed",
                        borderWidth: 1,
                        borderRadius: 2,
                        borderColor: "#bdbdbd",
                        height: "100px"
                      }}
                      activeStyle={{
                        borderStyle: "solid",
                        borderColor: "#d9534f"
                      }}
                    >
                      <div
                        style={{
                          marginTop: 10,
                          marginLeft: 12
                        }}
                      >
                        <p
                          style={{
                            color: "#989898"
                          }}
                        >
                          Drag & drop or click to upload a picture (single
                          jpg/png files only)
                        </p>
                        {this.state.myImage ? (
                          <p
                            style={{
                              color: "#d9534f",
                              fontWeight: "bold"
                            }}
                          >
                            File selected: {this.state.myImage.name}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </Dropzone>
                  </FormGroup>

                  <Button
                    bsStyle="primary"
                    onClick={e => {
                      e.preventDefault();
                      this.postRecipe();
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    style={{ marginLeft: "5px" }}
                    onClick={e => {
                      e.preventDefault();

                      this.setState({
                        showModal: false,
                        title: "",
                        category: "",
                        search: "",
                        contentState: ""
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </form>
              </div>
            </Modal.Body>
          </Modal>

          <Error />
          <Success />
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  category: state.reducer.category,
  search: state.reducer.search
});

const mapDispatchToProps = dispatch => ({
  setCategory: e => dispatch(setCategory(e)),
  setSearch: e => dispatch(setSearch(e)),
  addErrorMessage: e => dispatch(addErrorMessage(e)),
  addSuccessMessage: e => dispatch(addSuccessMessage(e))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
