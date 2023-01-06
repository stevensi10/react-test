import React from 'react'
import {Row,Col,Card, Breadcrumb} from 'react-bootstrap';
import queryString from 'query-string'

class EpisodeList extends React.Component {
    constructor(props) {
        super(props);
        var values = queryString.parse(this.props.history.location.search);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            season_number: values.season,
            tv_id: values.tv_id
        };
    }

    componentDidMount() {
      var url = "https://api.themoviedb.org/3/tv/"+this.state.tv_id+"?api_key=601b3e84fdc281626e092faf669205b5&language=en-US";
        fetch(url)
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                name: result.original_name
              });
            },
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )

        var url = "https://api.themoviedb.org/3/tv/"+this.state.tv_id+"/season/"+this.state.season_number+"?api_key=601b3e84fdc281626e092faf669205b5&language=en-US";
        fetch(url)
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                items: result.episodes
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
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Erreur : {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Chargement…</div>;
        } else {
            return (
              <div>
                <Row>
                  <Breadcrumb>
                    <Breadcrumb.Item href="#/series">TV</Breadcrumb.Item>
                    <Breadcrumb.Item href={"#/info?type=series&id=" + this.state.tv_id}>{this.state.name}</Breadcrumb.Item>
                    <Breadcrumb.Item active>Season {this.state.season_number}</Breadcrumb.Item>
                  </Breadcrumb>
                </Row>
                <Row>
                {
                  items.map((item, index) => (
                    <Episode
                    key={item.id}
                    name={item.name}
                    id={item.id}
                    episode_number={item.episode_number}
                    season_number={item.season_number}
                    tv_id={this.state.tv_id}
                    >
                    </Episode>
                  ))
                }
              </Row>
            </div>
            );
        }
    }
}

class Episode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            imagePath: null
        };
    }

    componentDidMount() {
        var url = "https://api.themoviedb.org/3/tv/"+this.props.tv_id+"/season/"+this.props.season_number+"/episode/"+this.props.episode_number+"?api_key=601b3e84fdc281626e092faf669205b5&language=en-US";
        fetch(url)
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                items: result,
                imagePath: result.still_path,
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
        const { error, isLoaded, items } = this.state;
        return(
            <Col sm={3} md={3} lg={3}>
                <Card className="card">
                    {this.state.imagePath != null
                    ? <Card.Img variant="top" src={"https://image.tmdb.org/t/p/w500/" + this.state.imagePath}></Card.Img>
                    : <span></span>
                    }
                    <Card.Body>
                        <Card.Title>{this.props.name}</Card.Title>
                        <hr></hr>
                        <Card.Text>
                          <span className="episodeText">{items.overview}</span>
                          <br></br><br></br>
                          <span className="episodeText">{items.air_date}</span>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}

export default EpisodeList