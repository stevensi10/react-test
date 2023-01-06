import React from 'react';
import {Form} from 'react-bootstrap';
class LanguageFilter extends React.Component {
    constructor(props) {
      super(props);
      this.language = this.language.bind(this);
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
        var url = "https://api.themoviedb.org/3/configuration/languages?api_key=601b3e84fdc281626e092faf669205b5&language=en-US";
        fetch(url)
          .then(res => res.json())
          .then(
            (result) => {
              /*Order array by language name*/
              result.sort(function(a, b) {
                var textA = a.english_name.toUpperCase();
                var textB = b.english_name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
              });
              this.setState({
                isLoaded: true,
                items: result
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
  
    language(e)
    {
      var value = e.target.value;
      this.props.onChange(value);
    }
    
    render() {
        const {items} = this.state;
        const options = items.map((item, index) => (
            <option
                key={item.iso_639_1}
                value={item.iso_639_1}
            >
            {item.english_name}
            </option>
          ));
      return (
        <Form.Group>
          <Form.Label>Original Language</Form.Label>
          <Form.Control as="select" onChange={this.language}>
            <option value="All" selected>All</option>
            {options}
          </Form.Control>
        </Form.Group>
      )
    }
}

export default LanguageFilter;