import React, { Component } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem
} from 'reactstrap';
import { Route, Link, NavLink, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SearchBar from './pages/SearchBar';
import api from '../api';
import Profile from './pages/Profile'
import SuccessLogin from './pages/SuccessLogin';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      countries: []
    }
  }

  handleLogoutClick(e) {
    api.logout()
  }

  render() {
    return (
      <div className="App">
      {/* Search Icon link for the SearchBar page */}
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossOrigin="anonymous"></link>
        <Navbar color="light" light>
            <NavbarBrand href="/"><img src='./images/wine.png' alt=""/></NavbarBrand>
            <Nav className="justify-content-end">
              <NavItem>
                {!api.isLoggedIn() && <NavLink to="/signup">Signup</NavLink>}
              </NavItem>
              <NavItem>
                {!api.isLoggedIn() && <NavLink to="/login">Login</NavLink>}
              </NavItem>
              <NavItem>
              {api.isLoggedIn() && <Link to={"/profile/"+JSON.parse(localStorage.getItem("user"))._id}>Profile</Link>}
              </NavItem>
              <NavItem>
              {api.isLoggedIn() && <Link to={"/search-wines"}>Search</Link>}
              </NavItem>
              <NavItem>
              {api.isLoggedIn() && <Link to="/" onClick={(e) => this.handleLogoutClick(e)}>Logout</Link>}
              </NavItem>
            </Nav>
        </Navbar>
        <div className="main">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/signup" component={Signup} />
            {api.isLoggedIn() && <Route path="/profile/:id" component={Profile} />}
            <Route path="/login" component={Login} />
            <Route path="/success-login" component={SuccessLogin} />
            <Route path="/search-wines" component={SearchBar} />
            <Route render={() => <h2>404</h2>} />
          </Switch>
        </div>
      </div>
    );
  }
}