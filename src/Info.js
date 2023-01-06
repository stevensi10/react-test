import React from 'react';
import {Row,Col, Breadcrumb, Image, Card, Table} from 'react-bootstrap';
import queryString from 'query-string';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock,faDollarSign} from '@fortawesome/free-solid-svg-icons'
import SeasonList from './SeasonList';
import BootstrapTable from 'react-bootstrap-table-next';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
};

class Info extends React.Component {
    constructor(props) {
      super(props);
      var values = queryString.parse(this.props.history.location.search);
      this.state = {
        id: values.id,
        type: values.type,
        info: {},
        cast: []
      }

      this.castColumns = [
        {
            dataField: 'profile_path',
            text: '',
            sort: false,
            type: 'string',
            formatter: this.castFormatter
          },
        {
        dataField: 'name',
        text: 'Name',
        sort: true,
        type: 'string'
      },
      ,
      {
        dataField: 'id',
        text: 'ID',
        hidden: true
      }
    ];

      this.seasonClick = this.seasonClick.bind(this);
    }

    seasonClick(season_number) {
        this.props.history.push({
            pathname: '/episodes',
            search: "?tv_id="+this.state.id+"&season=" + season_number
        });
    }

    castFormatter(cell, row) {
        return <Card.Img style={{width: "10%"}} src={ "https://image.tmdb.org/t/p/w500/" + cell}></Card.Img>

    }

    async componentDidMount() {
        var type = this.state.type;
        if(type == "series")
            var endpoint = "tv";
        else
            var endpoint = "movie";

        var url = "https://api.themoviedb.org/3/"+endpoint+"/"+this.state.id+"?api_key=601b3e84fdc281626e092faf669205b5&language=en-US";
        url += "&append_to_response=external_ids,videos,credits";
        console.log(url);
        var info = await fetch(url).then(res => res.json());

        console.log(info);

        this.setState({
            info: info,
            cast: info.credits.cast
        });
    }  

    render() {
        const { id, info, cast} = this.state;
        const imageLink = info.poster_path === undefined ? "" : "https://image.tmdb.org/t/p/w500/" + info.poster_path;

        const castList = cast !== undefined ? cast.map(array => {
            return  <div>
            <Card.Img variant="top" src={"https://image.tmdb.org/t/p/w500/" + array.profile_path} className="cursorPointer" style={{width: "80%"}}></Card.Img>
            <Card.Title>{array.name}</Card.Title>
            </div>
        }) : <span></span>

      return (
        <div>
            <Row>
                <Breadcrumb>
                    <Breadcrumb.Item href={"#/" + this.state.type}>Home</Breadcrumb.Item>
                    {this.state.type == "series" 
                    ? 
                    <Breadcrumb.Item active>{info.name}</Breadcrumb.Item>
                    : 
                    <Breadcrumb.Item active>{info.title}</Breadcrumb.Item>
                    }
                </Breadcrumb>
            </Row>
            <Row>
                <Col md={3}>
                    <Card.Img src={imageLink} thumbnail></Card.Img>
                </Col>
                <Col md={9}>
                    {this.state.type == "series" 
                    ? <Card.Title>{info.name}</Card.Title>
                    : <Card.Title>{info.title}</Card.Title>
                    }
                    {this.state.type == "series" 
                    ? <Card.Subtitle>{info.first_air_date} | <FontAwesomeIcon icon={faClock}></FontAwesomeIcon> {info.episode_run_time} min.</Card.Subtitle>
                    : <Card.Subtitle>{info.release_date} | <FontAwesomeIcon icon={faClock}></FontAwesomeIcon> {info.runtime} min. | <FontAwesomeIcon icon={faDollarSign}></FontAwesomeIcon> {currencyFormat(info.budget)} - <FontAwesomeIcon icon={faDollarSign}></FontAwesomeIcon> {currencyFormat(info.revenue)}</Card.Subtitle>
                    }

                    {
                        info.original_title != info.title ?
                        <Card.Subtitle>{info.original_title}</Card.Subtitle>
                        : <span></span>
                    }
                    <br></br>
                    <p><b>Summary:</b> {info.overview}</p>

                    <Carousel responsive={responsive}>
                        {castList}
                    </Carousel>
                </Col>
            </Row>
            {this.state.type == "series" ?
            <div>
                <hr></hr>
                <Card.Title>Seasons</Card.Title>
                <Row>
                    <SeasonList tv_id = {this.state.id}
                    onClick = {this.seasonClick}>
                    </SeasonList>
                </Row>
            </div>
            : <span></span>}
        </div>
      )
    }
}

function currencyFormat(num) {
    if(num == null)
        return 0;
    else
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
 }

export default Info;