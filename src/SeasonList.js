import React from 'react'
import {Row,Col,Card, Breadcrumb} from 'react-bootstrap';

class SeasonList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            tv_id: this.props.tv_id
        };
        this.seasonClick = this.seasonClick.bind(this);
    }

    seasonClick(season_number) {
      this.props.onClick(season_number);
    }

    componentDidMount() {
        var url = "https://api.themoviedb.org/3/tv/"+this.state.tv_id+"?api_key=601b3e84fdc281626e092faf669205b5&language=en-US";
        fetch(url)
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                items: result.seasons,
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
                {
                  items.map((item, index) => (
                    <Season
                    key={item.id}
                    name={item.name}
                    id={item.id}
                    season_number={item.season_number}
                    onClick = {this.seasonClick}
                    tv_id={this.state.tv_id}
                    >
                    </Season>
                  ))
                }
                </Row>
                </div>
            );
        }
    }
}

class Season extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            imagePath: null
        };
        this.seasonClick = this.seasonClick.bind(this);
    }

    seasonClick() {
        this.props.onClick(this.props.season_number);
    }

    componentDidMount() {
        var url = "https://api.themoviedb.org/3/tv/"+this.props.tv_id+"/season/"+this.props.season_number+"?api_key=601b3e84fdc281626e092faf669205b5&language=en-US";
        fetch(url)
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                items: result,
                imagePath: result.poster_path
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
        const numberEpisodes = items.episodes == null ? 0 : items.episodes.length;
        return(
            <Col sm={3} md={3} lg={3}>
                {numberEpisodes == 0 ? <span></span>
                :
                <Card className="card cursorPointer" onClick={this.seasonClick}>
                    {this.state.imagePath != null
                    ? <Card.Img variant="top" src={"https://image.tmdb.org/t/p/w500/" + this.state.imagePath} className="cover"></Card.Img>
                    : <span></span>
                    }
                    <Card.Body>
                        <Card.Title>{this.props.name} ({numberEpisodes})</Card.Title>
                        <Card.Text className="episodeText">{items.air_date}</Card.Text>
                    </Card.Body>
                </Card>
                }
            </Col>
        );
    }
}

export default SeasonList