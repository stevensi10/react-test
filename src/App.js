import React from 'react';
import Home from './Home';
import List from './List';
import Info from './Info';
import SeasonList from './SeasonList';
import EpisodeList from './EpisodeList';
import Cast from './Cast';
import {Container} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faTv,faFilm, faHome } from '@fortawesome/free-solid-svg-icons'
import {
  Route,
  HashRouter,
  NavLink
} from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/react-modal-video/scss/modal-video.scss';

function App() {
  return (
    <div>
      <Container>
          <HashRouter>
            <div>
              <nav class="navbar navbar-expand-sm navbar-light bg-light fixed-top">
                <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <a class="navbar-brand"><NavLink to="/home"><FontAwesomeIcon icon={faHome}></FontAwesomeIcon> Home</NavLink></a>
                  </li>
                  <li class="nav-item">
                    <a class="navbar-brand"><NavLink to="/movies"><FontAwesomeIcon icon={faFilm}></FontAwesomeIcon> Movies</NavLink></a>
                  </li>
                  <li class="nav-item">
                    <a class="navbar-brand"><NavLink to="/series"><FontAwesomeIcon icon={faTv}></FontAwesomeIcon> TV</NavLink></a>
                  </li>
                </ul>
              </nav>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Route path="/home"  render={({history}) => (
                  <Home 
                  history={history}
                  >
                  </Home>
                )}
            />
            <Route path="/series"  render={({history}) => (
                  <List 
                  history={history}
                  >
                  </List>
                )}
            />
            <Route path="/movies"  render={({history}) => (
                  <List 
                  history={history}
                  >
                  </List>
                )}
            />
            <Route path="/seasons"  render={({history}) => (
                  <SeasonList 
                  history={history}
                  >
                  </SeasonList>
                )}
            />
            <Route path="/episodes"  render={({history}) => (
                  <EpisodeList 
                  history={history}
                  >
                  </EpisodeList>
                )}
            />
            <Route path="/cast"  render={({history}) => (
                  <Cast 
                  history={history}
                  >
                  </Cast>
                )}
            />
            <Route path="/info"  render={({history}) => (
                  <Info 
                  history={history}
                  >
                  </Info>
                )}
            />
          </HashRouter>
      </Container>
    </div>
  );
}

export default App;
