import React from 'react';
import {Button, Row,Col} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import {
  Route,
  NavLink,
  HashRouter,
  withRouter 
} from "react-router-dom";

class Buttons extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <Row>
        <Col md={3}>
          <Button variant="primary"
          onClick={this.props.history.goBack}
          >
          <FontAwesomeIcon icon={faArrowLeft} />
          &nbsp;Back
          </Button>
        </Col>
      </Row>
    )
  }
}

export default withRouter(Buttons)