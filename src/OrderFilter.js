import React from 'react';
import {Form} from 'react-bootstrap';
class OrderFilter extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        items: {
            movies : ["original_title.asc", "original_title.desc", "popularity.asc", "popularity.desc", "primary_release_date.asc", "primary_release_date.desc", "release_date.asc", "release_date.desc", "revenue.asc", "revenue.desc", "vote_average.asc", "vote_average.desc", "vote_count.asc", "vote_count.desc"],
            series: ["first_air_date.desc", "first_air_date.asc", "popularity.desc", "popularity.asc", "vote_average.desc", "vote_average.asc"]
        }
      };
      this.order = this.order.bind(this);
    }

    order(e)
    {
      var value = e.target.value;
      this.props.onChange(value);
    }
    
    render() {
        const {items} = this.state;
        var type = this.props.type;
        var options;
        if(type == "movies")
        {
            options = items.movies.map((item, index) => (
                <option
                    key={item}
                    value={item}
                >
                {item}
                </option>
            ));
        }
        else if(type == "series")
        {
            options = items.series.map((item, index) => (
                <option
                    key={item}
                    value={item}
                >
                {item}
                </option>
            ));
        }
      return (
        <Form.Group>
            <Form.Label>Genre</Form.Label>
            <Form.Control as="select" onChange={this.order} value={this.props.order}>
            {options}
            </Form.Control>
        </Form.Group>
      )
    }
}

export default OrderFilter;