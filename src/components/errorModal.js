import React, { Component } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { addErrorMessage } from "../actions/actions";

class Error extends Component {
  render() {
    if (this.props.error) {
      return (
        <Modal
          bsSize="sm"
          show={true}
          onHide={() => this.props.addErrorMessage("")}
        >
          <Modal.Body>
            {" "}
            <Alert
              bsStyle="danger"
              onDismiss={() => this.props.addErrorMessage("")}
            >
              <h4>Error</h4>
              <p>{this.props.error}</p>
              <p>
                <Button onClick={() => this.props.addErrorMessage("")}>
                  Hide
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
  error: state.reducer.error
});

const mapDispatchToProps = dispatch => ({
  addErrorMessage: e => dispatch(addErrorMessage(e))
});

export default connect(mapStateToProps, mapDispatchToProps)(Error);
