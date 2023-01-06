import React from 'react';
import {Row,Col, Breadcrumb, Image} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import '../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import queryString from 'query-string';

class Cast extends React.Component {
  constructor(props) {
    super(props);
    var values = queryString.parse(this.props.history.location.search);
    this.state = {
        id: values.cast_id,
        error: null,
        isLoaded: false,
        info: {},
        credits: []
    };
    this.columns = [{
        dataField: 'title',
        text: 'Title',
        sort: true,
        type: 'string',
        formatter: this.titleFormatter
      }, {
        dataField: 'jobs',
        text: 'Job / Role',
        sort: true,
        type: 'string'
      }, {
        dataField: 'release_date',
        text: 'Release Date',
        sort: true,
        type: 'date'
      }, {
        dataField: 'imdbRating',
        text: 'IMDB Rating',
        sort: true,
        type: 'number'
      },
      {
        dataField: 'rottenRating',
        text: 'Rotten Tomatoes',
        sort: true,
        type: 'number',
        formatter: this.rottenFormatter
      },
      {
        dataField: 'id',
        text: 'ID',
        hidden: true
      }
    ];
  }

  async componentDidMount() {
    var component = this;
    var urlInfo = "https://api.themoviedb.org/3/person/"+this.state.id+"?api_key=601b3e84fdc281626e092faf669205b5&language=en-US";
    var info = await fetch(urlInfo).then(res => res.json());

    var credits = [];

    var url = "https://api.themoviedb.org/3/person/"+this.state.id+"/combined_credits?api_key=601b3e84fdc281626e092faf669205b5&language=en-US";
    await fetch(url).then(res => res.json()).then(
        async (result) => {
            var crew = [];
            if(typeof result.crew !== undefined){
                result.crew.forEach(function(element,index) {
                    var data = element;
                    var id = element.id;
                    var jobs = element.job;
                    result.crew.splice(index,1);
                    result.crew.forEach(function(element2,index2) {
                        if(id === element2.id && index !== index2)
                        {

                            jobs += ", " + element2.job;
                            result.crew.splice(index2,1);
                        }
                    });
                    if(typeof result.cast !== "undefined"){
                        result.cast.forEach(function(element3,index3) {
                            if(id === element3.id)
                            {
                                jobs += ", " + element3.character;
                                result.cast.splice(index3,1);
                            }
                        });
                    }

                    data.jobs = jobs;
                    crew.push(data);
                });
            }

            var cast = [];
            if(typeof result.cast !== undefined){
                result.cast.forEach(function(element,index) {
                    var data = element;
                    var id = element.id;
                    var jobs = element.character;
                    result.cast.forEach(function(element2,index2) {
                        if(id === element2.id && index !== index2)
                        {

                            jobs += ", " + element2.character;
                            result.cast.splice(index2,1);
                        }
                    });
                    data.jobs = jobs;
                    cast.push(data);
                });
            }

            var allData = cast.concat(crew);
            allData.forEach(async function(element,index) {
                var array = element;
                var type = element.media_type;
                if(type === "tv"){
                    array.title = element.name;
                    array.release_date = element.first_air_date;
                }

                var url = "https://api.themoviedb.org/3/"+type+"/"+element.id+"?api_key=601b3e84fdc281626e092faf669205b5&language=en-US";
                url += "&append_to_response=external_ids,videos";
                await fetch(url).then((res) => res.json()).then( async(resultDetails) => 
                {
                    /*var imdb_id = resultDetails.external_ids.imdb_id;
                    let url = 'http://www.omdbapi.com/?apikey=faa4a160&i=' + imdb_id;
                    await fetch(url).then((res) => res.json()).then((resultIMDB) => 
                    {
                        var imdbVotes = resultIMDB.imdbVotes;
                        if(imdbVotes === "N/A")
                            imdbVotes = null;
                        var imdbRating = resultIMDB.imdbRating;
                        if(imdbRating === "N/A")
                            imdbRating = null;

                        var ratings = resultIMDB.Ratings;
                        var rottenRating = "";
                        if(typeof ratings !== "undefined")
                        {
                            ratings.forEach(function(rating,index) {
                                if(rating.Source === "Rotten Tomatoes")
                                    rottenRating = rating.Value;
                            });
                        }
                        

                        if(imdbRating === "N/A")
                            imdbRating = null;
                        array.imdbVotes = parseFloat(imdbVotes);
                        array.imdbRating = parseFloat(imdbRating);
                        if(rottenRating !== "" && rottenRating !== null)
                            array.rottenRating = parseFloat(rottenRating.replace(/(\%)/, ""));
                    });*/
                });
                credits.push(array);
          });

          this.setState({
            isLoaded: true,
            credits: credits,
            info: info
          });
        }
      )
  }

  titleFormatter(cell, row) {
    return <b>{ cell }</b>
  }

  rottenFormatter(cell, row) {
      if(row.rottenRating != null && row.rottenRating != "")
          return <div><span>{ cell }%</span></div>
  }
  
  render() {
    const { id, info, credits, isLoaded} = this.state;
    const imageLink = info.profile_path === undefined ? "" : "https://image.tmdb.org/t/p/w500/" + info.profile_path;

    const defaultSorted  = [{
        dataField: 'release_date',  // default sort column name
        order: 'desc'  // default sort order
    }];

    if (!this.state.isLoaded) {
      return <div className="App">Loading...</div>;
    }

    return (
        <div>
            <Row>
                <Breadcrumb>
                    <Breadcrumb.Item href="#/movies">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>{info.name}</Breadcrumb.Item>
                </Breadcrumb>
            </Row>
            <Row>
                <Col md={3}>
                    <Image src={imageLink} thumbnail></Image>
                </Col>
                <Col md={9}>
                    <BootstrapTable
                    keyField='id' 
                    data={credits} 
                    columns={this.columns} 
                    defaultSorted={defaultSorted}
                    striped
                    noDataIndication="No Data"
                    ></BootstrapTable>
                </Col>
            </Row>
        </div>
    )
  }
}

export default Cast;