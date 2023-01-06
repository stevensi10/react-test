import React from 'react'
import './List.css';
import {Container,Row,Col,Card, Accordion, Button, Tabs, Tab, Badge} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faList, faHeart} from '@fortawesome/free-solid-svg-icons';
import ModalVideo from 'react-modal-video';
import Search from './Search';
import GenreFilter from './GenreFilter';
import LanguageFilter from './LanguageFilter';
import OrderFilter from './OrderFilter';
import YearFilter from './YearFilter';
import { MDBBadge } from 'mdb-react-ui-kit';

class List extends React.Component {
    constructor(props) {
        super(props);
        var type = this.props.history.location.pathname;
        type = type.replace("/", "");
        var currentYear = new Date().getFullYear();
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            currentPage: 1,
            perPage: 20,
            countResults: 0,
            search: '',
            type: type,
            genre: 'All',
            language: 'All',
            order: 'popularity.desc',
            years: { min: 1900, max: currentYear }
        };
        this.castClick = this.castClick.bind(this);
        this.infoClick = this.infoClick.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.getData = this.getData.bind(this);
        this.search = this.search.bind(this);
        this.genre = this.genre.bind(this);
        this.language = this.language.bind(this);
        this.order = this.order.bind(this);
        this.years = this.years.bind(this);
        this.genreClick = this.genreClick.bind(this);
    }

    castClick(cast_id) {
      this.props.history.push({
          pathname: '/cast',
          search: "?cast_id="+cast_id
      });
    }

    infoClick(type,id) {
      this.props.history.push({
          pathname: '/info',
          search: "?type=" + type + "&id=" + id
      });
  }

    genreClick(genre) {
      this.setState({genre:genre});
      this.genre(genre);
    }

    componentDidMount() {
      this.getData();
    }      

    pageChange(event) {
      this.setState({currentPage: Number(event.target.id)},
        () => {this.afterChange();}
      );
    }

    search(value) {
      this.setState({search: value},
        () => {this.afterChange();}
      );
    }

    genre(value) {
      this.setState({genre: value},
        () => {this.afterChange();}
      );
    }

    language(value) {
      this.setState({language: value},
        () => {this.afterChange();}
      );
    }

    order(value) {
      this.setState({order: value},
        () => {this.afterChange();}
      );
    }

    years(value) {
      this.setState({years: value},
        () => {this.afterChange();}
      );
    }

    afterChange() {
      this.getData();
    }

    getData()
    {
        this.setState({items: []});
        var search = this.state.search;
        var genre = this.state.genre;
        var language = this.state.language;
        var type = this.state.type;
        var order = this.state.order;
        var years = this.state.years;

        var lowerYear = years.min + "-01-01";
        var greaterYear = years.max + "-12-31";

        if(type == "series")
          var typeEndpoint = "tv";
        else
          var typeEndpoint = "movie";

        if(search != '' && search != null){
            var endpoint = "search/" + typeEndpoint;
        }
        else {
          var endpoint = "discover/" + typeEndpoint;
        }

        var url = "https://api.themoviedb.org/3/" + endpoint + "?api_key=601b3e84fdc281626e092faf669205b5&language=en-US";
        if(genre != 'All'){
          url += "&with_genres=" + genre;
        }
        if(language != 'All'){
          url += "&with_original_language=" + language;
        }
        if(search != '' && search != null)
          url += "&query=" + search;

        url += "&sort_by=" + order;

        if(type == "movies")
        {
          url += "&primary_release_date.gte=" + lowerYear;
          url += "&primary_release_date.lte=" + greaterYear;
        }
        else if(type == "series")
        {
          url += "&first_air_date.gte=" + lowerYear;
          url += "&first_air_date.lte=" + greaterYear;
        }
        url += "&page=" + this.state.currentPage;

        fetch(url)
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                items: result.results,
                countResults: result.total_results
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

    render() {
        const { error, isLoaded, items, countResults, type} = this.state;

        const pageNumbers = [];
        const currentPage = this.state.currentPage;

        if(countResults > 0)
        {
          if(currentPage != 1)
            pageNumbers.push([1,"First"]);
          if(currentPage > 2)
            pageNumbers.push([currentPage-2,currentPage-2]);
          if(currentPage > 1)
            pageNumbers.push([currentPage-1,currentPage-1]);
          pageNumbers.push([currentPage,currentPage]);
          if(currentPage < Math.ceil(countResults / this.state.perPage))
            pageNumbers.push([currentPage+1,currentPage+1]);
          if(currentPage < Math.ceil(countResults / this.state.perPage) - 1)
            pageNumbers.push([currentPage+2,currentPage+2]);
          if(currentPage != Math.ceil(countResults / this.state.perPage))
            pageNumbers.push([Math.ceil(countResults / this.state.perPage),"Last"]);
        }

        const renderPageNumbers = pageNumbers.map(array => {
          switch(array[1])
          {
            case 'First':
              return (
                <li className="page-item">
                  <a className="page-link" href={'#/' + type}
                  key={array[1]}
                  id={array[0]}
                  onClick={this.pageChange}
                  >
                  <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
              );
              break;
            case 'Last':
              return (
                <li className="page-item">
                  <a className="page-link" href={'#/' + type}
                  key={array[1]}
                  id={array[0]}
                  onClick={this.pageChange}
                  >
                  <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              );
              break;
            default:
              return (
                <li className="page-item">
                  {this.state.currentPage != array[0]
                  ?
                  <a className="page-link" href={'#/' + type}
                  key={array[1]}
                  id={array[0]}
                  onClick={this.pageChange}
                  >
                  {array[1]}
                  </a>
                  :
                  <a className="page-link"
                  key={array[1]}
                  id={array[0]}
                  >
                  {array[1]}
                  </a>
                  }
                </li>
              );
              break;
          }
        });

        const data = items.map((item, index) => (
          <MediaCard
          key={item.id}
          id={item.id}
          castClick = {this.castClick}
          genreClick = {this.genreClick}
          infoClick = {this.infoClick}
          type={type}
          >
          </MediaCard>
        ));

        if (error) {
            return <div>Erreur : {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Chargement…</div>;
        } else {
            return (
              <div>
                <Row>
                  <Col md={12}>
                    <Search onChange={this.search}></Search>
                    <Row>
                      <Col md={4}>
                        <GenreFilter type={type} onChange={this.genre} value={this.state.genre}></GenreFilter>
                      </Col>
                      <Col md={4}>
                        <LanguageFilter onChange={this.language}></LanguageFilter>
                      </Col>
                      <Col md={4}>
                        <OrderFilter type={type} onChange={this.order} order={this.state.order}></OrderFilter>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <YearFilter onChange={this.years} years={this.state.years}></YearFilter>
                      </Col>
                    </Row>
                    <br></br>
                  </Col>
                </Row>
                <Row>
                  {data}
                </Row>
                <Row>
                  <Col md={12}>
                    <nav className ="text-xs-center">
                      <ul id="page-numbers" className="pagination">
                        {renderPageNumbers}
                      </ul>
                    </nav>
                  </Col>
                </Row>
              </div>
            );
        }
    }
}

class MediaCard extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          error: null,
          isLoaded: false,
          items: [],
          imagePath: null,
          imdbID: null,
          imdbVotes: null,
          imdbRating: null,
          videoLink: null,
          isOpen: false,
          cast: [],
          directors: [],
          writers: []
      };
      this.openModal = this.openModal.bind(this);
      this.castClick = this.castClick.bind(this);
      this.genreClick = this.genreClick.bind(this);
      this.infoClick = this.infoClick.bind(this);
  }

  infoClick(type) {
    this.props.infoClick(this.props.type, this.props.id);
  }

  castClick(id) {
    this.props.castClick(id);
  }

  genreClick(id) {
    this.props.genreClick(id);
  }

  openModal () {
      this.setState({isOpen: true})
  }

  componentDidMount() {
      var type = this.props.type;
      if(type == "series")
        var endpoint = "tv";
      else
        var endpoint = "movie";
      var url = "https://api.themoviedb.org/3/"+endpoint+"/"+this.props.id+"?api_key=601b3e84fdc281626e092faf669205b5&language=en-US";
      url += "&append_to_response=external_ids,videos,credits";
      
      var videoLink = '';
      fetch(url)
        .then(res => res.json())
        .then(
          (result) => {
              if(typeof result.videos !== "undefined")
              {
                  for(var j = 0; j < result.videos.results.length; j++)
                  {
                      if(result.videos.results[j].type == 'Trailer')
                      {
                          videoLink = result.videos.results[j].key;
                      }
                  }
              }
              var cast = [];
              if(typeof result.credits !== "undefined")
              {
                  for(var k = 0; k < 5; k++)
                  {
                    if(typeof result.credits.cast[k] !== "undefined")
                      cast[k] = {'id': result.credits.cast[k].id, 'name': result.credits.cast[k].name};
                  }
              }
              var directors = [];
              if(typeof result.credits !== "undefined")
              {
                  for(var k = 0; k < result.credits.crew.length; k++)
                  {
                    if(result.credits.crew[k].job == "Director")
                      directors.push({'id': result.credits.crew[k].id, 'name': result.credits.crew[k].name});
                  }
              }
              var writers = [];
              if(typeof result.credits !== "undefined")
              {
                  for(var k = 0; k < result.credits.crew.length; k++)
                  {
                    if(result.credits.crew[k].job == "Screenplay")
                      writers.push({'id': result.credits.crew[k].id, 'name': result.credits.crew[k].name});
                  }
              }
            this.setState({
              isLoaded: true,
              items: result,
              imagePath: "https://image.tmdb.org/t/p/w500/" + result.poster_path,
              imdbID: result.external_ids.imdb_id,
              videoLink: videoLink,
              cast: cast,
              directors: directors,
              writers: writers
            });
            let url = 'http://www.omdbapi.com/?apikey=faa4a160&i=' + result.external_ids.imdb_id;
            fetch(url).then((res) => res.json()).then((data) => 
            {
              var imdbVotes = data.imdbVotes;
              if(imdbVotes === "N/A")
                imdbVotes = null;
              var imdbRating = data.imdbRating;
              if(imdbRating === "N/A")
                imdbRating = null;

              this.setState({
                imdbVotes: imdbVotes,
                imdbRating: imdbRating
              });
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

  render() {
      const { error, isLoaded, items, imdbVotes, imdbRating, videoLink, cast, directors, writers} = this.state;
      const imdbLink= "https://www.imdb.com/title/" + this.state.imdbID + "/?ref_=plg_rt_1";
      const genres = items.genres !== undefined ? items.genres.map(array => {
          return <MDBBadge className='genre' onClick={() => this.genreClick(array.id)} style={{cursor: 'pointer'}} >{array.name}</MDBBadge>
      }) : <span></span>

      const directorList = directors !== undefined ? directors.map(array => {
        return <span><a href="javascript:console.log(clicked)" onClick={() => this.castClick(array.id)} id={array.id}>{array.name}</a>&nbsp;</span>
      }) : <span></span>

      const writerList = writers !== undefined ? writers.map(array => {
        return <span><a href="javascript:console.log(clicked)" onClick={() => this.castClick(array.id)} id={array.id}>{array.name}</a>&nbsp;</span>
      }) : <span></span>

      const castList = cast !== undefined ? cast.map(array => {
        return <li className="cast"><a href="javascript:console.log(clicked)" onClick={() => this.castClick(array.id)} id={array.id}>{array.name}</a></li>
      }) : <span></span>

      const video = videoLink == '' ? '' : 
      <div class="youtubeLink">
          <ModalVideo channel='youtube' isOpen={this.state.isOpen} videoId={videoLink} onClose={() => this.setState({isOpen: false})}>
          </ModalVideo>
          <img onClick={this.openModal} style={{width:"60px", height:"50px", cursor: 'pointer'}} src='https://www.freepnglogos.com/uploads/youtube-logo-hd-8.png' tooltip></img>
      </div>;
      return(
          <Col sm={3} md={3} lg={3}>
              <Card className="card">
                  <div className="image-container d-flex justify-content-start m-3'">
                    <Card.Img variant="top" src={this.state.imagePath} className="cover cursorPointer" onClick={this.infoClick}></Card.Img>
                    <div className='overlay d-flex align-items-center justify-content-center'>
                      Add to Favourites &nbsp;<FontAwesomeIcon icon={faHeart} style={{color: "red"}}></FontAwesomeIcon>
                    </div>
                  </div>
                  <Card.Body>
                      {this.props.type == "movies" 
                      ? <Card.Title>{items.title} ({(new Date(items.release_date).getFullYear())})</Card.Title>
                      : <a><Card.Title 
                      className="cursorPointer" 
                      onClick={this.seriesClick}>{items.name} ({(new Date(items.first_air_date).getFullYear())})
                      </Card.Title></a>
                      }
                      {this.props.type == "series" ? <Card.Subtitle>Season(s): {items.number_of_seasons} <br></br>
                      <span>Status: </span> <span className={(items.status == "Canceled" || items.status == "Pilot" ? 'statusRed' : 'statusGreen')}>&nbsp;{items.status}</span></Card.Subtitle>
                      : <span></span>}
                      {video}
                      <Card.Text className="episodeText">
                        <Container>
                          <Tabs defaultActiveKey="info">
                            <Tab eventKey="info" title="Info">
                              <br></br>
                              <Row>
                                <div>
                                  {this.state.imdbID != null
                                  ? <span><span className="imdbRatingPlugin" data-user="ur30238090" data-title={this.state.imdbID} data-style="p3"></span>
                                  <a target="_blank" href={imdbLink}>
                                    <img title="Open on IMDB" src="https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/images/imdb_37x18.png"/>
                                  </a></span>
                                  : <span></span>
                                  }
                                  {imdbRating != null
                                  ? <span><span style={{'font-weight': 'bold'}}>&nbsp;{imdbRating}</span><span style={{'font-size': "0.6em"}}>/10</span><span style={{'font-size': '0.8em', 'color': 'grey'}}>&nbsp;&nbsp;{imdbVotes} votes</span></span>
                                  : <span></span>
                                  }
                                </div>
                              </Row>
                              <Row className="rowGenre">
                                {genres}
                              </Row>
                              {items.overview != "" && items.overview != null
                              ?
                                <Row>
                                  <Accordion defaultActiveKey="1">
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                      <FontAwesomeIcon icon={faList}></FontAwesomeIcon>&nbsp;Summary
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="0">
                                      <span>{items.overview}</span>
                                    </Accordion.Collapse>
                                  </Accordion>
                                </Row>
                              : <span></span>
                              }
                            </Tab>
                            <Tab eventKey="cast" title="Cast">
                              <br></br>
                              Director(s): {directorList}
                              <br></br>
                              Writer(s): {writerList}
                              <br></br>
                              <span>Cast:</span>
                              <ul>
                                {castList}
                              </ul>
                            </Tab>
                          </Tabs>
                        </Container>
                      </Card.Text>
                  </Card.Body>
              </Card>
          </Col>
      );
  }
}

export default List