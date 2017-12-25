import React, { Component } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { addSuccessMessage } from "../actions/actions";

class Success extends Component {
  render() {
    if (this.props.success) {
      return (
        <Modal
          bsSize="sm"
          show={true}
          onHide={() => this.props.addSuccessMessage("")}
        >
          <Modal.Body>
            {" "}
            <Alert
              bsStyle="warning"
              onDismiss={() => this.props.addSuccessMessage("")}
            >
              <h4>Success!</h4>
              <p>{this.props.success}</p>
              <p>
                <Button onClick={() => this.props.addSuccessMessage("")}>
                  Close
                </Button>
              </p>
            </Alert>
          </Modal.Body>
        </Modal>
      );
    } else {
      return <div />;
    }
  }
}

const mapStateToProps = state => ({
  success: state.success
});

const mapDispatchToProps = dispatch => ({
  addSuccessMessage: e => dispatch(addSuccessMessage(e))
});

export default connect(mapStateToProps, mapDispatchToProps)(Success);
