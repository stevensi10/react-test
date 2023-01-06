import React from 'react';
import {Form} from 'react-bootstrap';
class GenreFilter extends React.Component {
    constructor(props) {
      super(props);
      this.genre = this.genre.bind(this);
      this.getData = this.getData.bind(this);
      this.state = {
        error: null,
        isLoaded: false,
        items: []
        }
    }

    componentDidMount() {
        this.getData();
      }  

    getData()
    {
        var type = this.props.type;
        if(type == "series")
          var typeEndpoint = "tv";
        else
          var typeEndpoint = "movie";
        var endpoint = "genre/" + typeEndpoint + "/list";
        var url = "https://api.themoviedb.org/3/" + endpoint + "?api_key=601b3e84fdc281626e092faf669205b5&language=en-US";
        fetch(url)
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                items: result.genres,
              });
            },
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
      }
  
    genre(e)
    {
      var value = e.target.value;
      this.props.onChange(value);
    }
    
    render() {
        const {items} = this.state;
        const options = items.map((item, index) => (
            this.props.value == item.id ?
            <option
              key={item.id}
              value={item.id}
              selected
            >
            {item.name}
            </option>
            :
            <option
              key={item.id}
              value={item.id}
            >
            {item.name}
            </option>
          ));
      return (
        <Form.Group>
          <Form.Label>Genre</Form.Label>
          <Form.Control as="select" onChange={this.genre}>
            <option value="All" selected>All</option>
            {options}
          </Form.Control>
        </Form.Group>
      )
    }
}

export default GenreFilter;