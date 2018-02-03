import React, { Component } from "react";
import draftToHtml from "draftjs-to-html";
import { connect } from "react-redux";
import { addErrorMessage, addSuccessMessage } from "../actions/actions";
import {
  Button,
  Modal,
  FormGroup,
  FormControl,
  ControlLabel,
  Glyphicon,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import { Transformation, Image } from "cloudinary-react";
import Dropzone from "react-dropzone";
import request from "superagent";

const CLOUDINARY_UPLOAD_PRESET = "exabyfdn";
const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/brianhallerweb/upload";

class DisplayRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      category: "",
      cloudinaryId: "",
      contentState: "",
      id: props.match.params.id,
      showPicModal: false,
      showModal: false,
      inFocus: false,
      myImage: "",
      starSelected: false
    };
  }

  componentDidMount() {
    fetch("/recipes/" + this.state.id)
      .then(response => response.json())
      .then(recipe =>
        this.setState({
          title: recipe.title,
          category: recipe.category,
          cloudinaryId: recipe.cloudinaryId,
          contentState: recipe.content,
          starSelected: recipe.starSelected
        })
      );
  }

  onContentStateChange: Function = contentState => {
    this.setState({
      contentState
    });
  };

  editRecipe = () => {
    let upload = request
      .post(CLOUDINARY_UPLOAD_URL)
      .field("upload_preset", CLOUDINARY_UPLOAD_PRESET)
      .field("file", this.state.myImage);

    upload.end((err, response) => {
      if (err) {
        console.log(err);
      }

      if (response.body.secure_url !== "") {
        fetch("/editrecipes/" + this.state.id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            cloudinaryIdDelete: this.state.cloudinaryId,
            cloudinaryId: response.body.public_id,
            title: this.state.title,
            category: this.state.category,
            content: this.state.contentState
          })
        }).then(() => {
          this.setState({ showModal: false });
          fetch("/recipes/" + this.state.id)
            .then(response => response.json())
            .then(recipe =>
              this.setState({
                title: recipe.title,
                category: recipe.category,
                cloudinaryId: recipe.cloudinaryId,
                contentState: recipe.content
              })
            );
        });
      }
    });
  };

  deleteRecipe = () => {
    fetch("/deleterecipes/" + this.state.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: this.state.id,
        cloudinary_id: this.state.cloudinaryId
      })
    })
      .then(response => {
        if (response.status === 500) {
          this.props.addErrorMessage(
            "Your recipe failed to delete. You'll have to try again."
          );
        } else if (response.status === 200) {
          this.props.addSuccessMessage(this.state.title + " has been deleted.");
        }
      })
      .then(() => {
        this.props.history.push("/");
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

  async clickStar() {
    await this.setState({ starSelected: !this.state.starSelected });

    fetch("/star/" + this.state.id, {
      method: "Put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        starSelected: this.state.starSelected
      })
    });
  }

  render() {
    const tooltip = (
      <Tooltip placement="bottom" className="in" id="tooltip-bottom">
        edit
      </Tooltip>
    );
    const tooltipStar = (
      <Tooltip placement="right" className="in" id="tooltip-right">
        Toggle Favorite
      </Tooltip>
    );
    return (
      <div className="displayRecipe">
        <div
          className="imageHeader"
          onClick={() => this.setState({ showPicModal: true })}
        >
          <Image cloudName="brianhallerweb" publicId={this.state.cloudinaryId}>
            <Transformation height="128" width="192" crop="fill" />
          </Image>
        </div>
        <Modal
          show={this.state.showPicModal}
          onHide={() => this.setState({ showPicModal: false })}
        >
          <Modal.Body>
            <div
              className="imageModal"
              onClick={() => this.setState({ showPicModal: false })}
            >
              <Image
                cloudName="brianhallerweb"
                publicId={this.state.cloudinaryId}
              >
                <Transformation height="400" width="600" crop="fill" />
              </Image>
            </div>
          </Modal.Body>
        </Modal>

        <h4>
          {this.state.title}{" "}
          <div
            className={this.state.starClass}
            style={{ display: "inline" }}
            onClick={this.clickStar.bind(this)}
          >
            <OverlayTrigger placement="right" overlay={tooltipStar}>
              {this.state.starSelected ? (
                <i
                  className="fa fa-star"
                  style={{
                    marginLeft: "15px",
                    fontSize: "18px",
                    color: "gold"
                  }}
                />
              ) : (
                <i
                  className="fa fa-star-o"
                  style={{
                    marginLeft: "15px",
                    fontSize: "18px"
                  }}
                />
              )}
            </OverlayTrigger>
          </div>
        </h4>

        <div
          className="instructions"
          dangerouslySetInnerHTML={{
            __html: draftToHtml(this.state.contentState)
          }}
        />
        <div
          className="edit"
          onClick={() => this.setState({ showModal: true })}
        >
          <OverlayTrigger placement="bottom" overlay={tooltip}>
            <Glyphicon glyph="glyphicon glyphicon-edit" />
          </OverlayTrigger>
        </div>
        <Modal dialogClassName="adModal" show={this.state.showModal}>
          <Modal.Body>
            <div className="modalBody">
              <form>
                <FormGroup>
                  <ControlLabel className="titleLabel">Title</ControlLabel>
                  <FormControl
                    type="text"
                    defaultValue={this.state.title}
                    onChange={e => this.setState({ title: e.target.value })}
                  />
                </FormGroup>

                <FormGroup controlId="formControlsSelect">
                  <ControlLabel className="categoryLabel">
                    Category
                  </ControlLabel>
                  <FormControl
                    componentClass="select"
                    value={this.state.category}
                    onChange={e => {
                      this.setState({
                        category: e.target.value
                      });
                    }}
                  >
                    <option value="salad">Salad</option>,
                    <option value="soup">Soup</option>,
                    <option value="main">Main</option>,
                    <option value="side">Side</option>,
                    <option value="drink">Drink</option>
                    <option value="dessert">Dessert</option>
                    <option value="misc">Misc</option>
                  </FormControl>
                </FormGroup>

                <FormGroup controlId="formControlsTextarea">
                  <ControlLabel className="instructionsLabel">
                    Instructions
                  </ControlLabel>

                  <Editor
                    toolbarHidden={true}
                    initialContentState={this.state.contentState}
                    editorClassName={
                      this.state.inFocus ? "targetEditorFocus" : "targetEditor"
                    }
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
                    value="test"
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
                        Drag & drop or click to upload a new picture. Existing
                        picture will be deleted.
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
                    this.editRecipe();
                  }}
                >
                  Update
                </Button>
                <Button
                  style={{ marginLeft: "5px" }}
                  onClick={e => {
                    e.preventDefault();

                    this.setState({
                      showModal: false
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  style={{ position: "fixed", right: 15 }}
                  bsStyle="danger"
                  onClick={e => {
                    e.preventDefault();
                    this.deleteRecipe();
                  }}
                >
                  <i className="fa fa-trash" style={{ fontSize: "17px" }} />
                </Button>
              </form>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  category: state.reducer.category
});

const mapDispatchToProps = dispatch => ({
  addErrorMessage: e => dispatch(addErrorMessage(e)),
  addSuccessMessage: e => dispatch(addSuccessMessage(e))
});

export default connect(mapStateToProps, mapDispatchToProps)(DisplayRecipe);
