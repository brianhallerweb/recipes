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

class DisplayRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      category: "",
      contentState: "",
      id: props.match.params.id,
      showModal: false,
      inFocus: false
    };
  }

  componentDidMount() {
    fetch("/recipes/" + this.state.id)
      .then(response => response.json())
      .then(recipe =>
        this.setState({
          title: recipe.title,
          category: recipe.category,
          contentState: recipe.content
        })
      );
  }

  onContentStateChange: Function = contentState => {
    this.setState({
      contentState
    });
  };

  editRecipe = () => {
    fetch("/editrecipes/" + this.state.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: this.state.title,
        category: this.state.category,
        content: this.state.contentState
      })
    }).then(() => {
      this.setState({ showModal: false });
    });
  };

  deleteRecipe = () => {
    fetch("/deleterecipes/" + this.state.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: this.state.id
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

  render() {
    const tooltip = (
      <Tooltip placement="bottom" className="in" id="tooltip-bottom">
        edit
      </Tooltip>
    );
    return (
      <div className="displayRecipe">
        <h4>{this.state.title}</h4>
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
        <Modal
          dialogClassName="adModal"
          show={this.state.showModal}
          onHide={() => {
            this.setState({ showModal: false });
          }}
        >
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
                  bsStyle="danger"
                  onClick={e => {
                    e.preventDefault();
                    this.deleteRecipe();
                  }}
                >
                  Delete
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
              </form>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  category: state.category
});

const mapDispatchToProps = dispatch => ({
  addErrorMessage: e => dispatch(addErrorMessage(e)),
  addSuccessMessage: e => dispatch(addSuccessMessage(e))
});

export default connect(mapStateToProps, mapDispatchToProps)(DisplayRecipe);
