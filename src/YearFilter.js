import React from 'react';
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";
class YearFilter extends React.Component {
    constructor(props) {
      super(props);
      this.years = this.years.bind(this);
    }

    years(e)
    {
      var value = e;
      this.props.onChange(value);
    }
    
    render() {
        var currentYear = new Date().getFullYear();
        var maxValue = currentYear + 3;
        return (
          <InputRange 
          minValue={1900}
          maxValue={maxValue}
          value={this.props.years}
          onChange={this.years}
          step={1}
          />
        )
    }
}

export default YearFilter;