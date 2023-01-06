import React from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
class Home extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        }
    }

    componentDidMount() {

    }  

    render() {
      return (
        <ListGroup>
          <ListGroupItem>Corriger tableau pour une personne</ListGroupItem>
          <ListGroupItem>Ajout utilisateurs (Inscription / Connection / Profil)</ListGroupItem>
          <ListGroupItem>Ajout wishlist par utilisateur</ListGroupItem>
          <ListGroupItem>Faire une page spécifique en cliquant sur image d'un film</ListGroupItem>
          <ListGroupItem>Tests sur mobile</ListGroupItem>
          <ListGroupItem>Attendre que les années soient changées avant de regénérer</ListGroupItem>
        </ListGroup>
      )
    }
}

export default Home;