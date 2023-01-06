import React from 'react';
import {Form} from 'react-bootstrap';
class Search extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        search: null,
        timer: null,
        timerInterval: 500, //If user stop writing for 0.5 seconds in the input, it triggers a search
      };
      this.search = this.search.bind(this);
      this.onInputChange = this.onInputChange.bind(this);
      this.startTimer = this.startTimer.bind(this);
    }

    search()
    {
      var searchValue = this.state.search;
      if(this.state.timer != 0){
        this.props.onChange(searchValue);
      }
    }

    startTimer()
    {
      clearTimeout(this.state.timer);
      this.setState({
        timer: setTimeout(this.search, this.state.timerInterval)
      });
    }

    onInputChange(e)
    {
      this.setState({search: e.target.value});
      this.startTimer();
    }
    
    render() {
      return (
        <Form.Control 
        type="text" 
        placeholder="Search..." 
        onChange={this.onInputChange}
        />
      )
    }
}

export default Search;