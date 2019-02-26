import React, { Component } from 'react';
import { Route, Link, NavLink, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import api from '../api';
import Profile from './pages/Profile'

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
        <header className="App-header">
          <NavLink to="/" exact>Home</NavLink>
          {!api.isLoggedIn() && <NavLink to="/signup">Signup</NavLink>}
          {!api.isLoggedIn() && <NavLink to="/login">Login</NavLink>}
          {api.isLoggedIn() && <Link to="/" onClick={(e) => this.handleLogoutClick(e)}>Logout</Link>}
          {api.isLoggedIn() && <Link to="/profile">Profile</Link>}
        </header>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/signup" component={Signup} />
          {api.isLoggedIn() && <Route path="/profile" component={Profile} />}
          <Route path="/login" component={Login} />
          <Route render={() => <h2>404</h2>} />
        </Switch>
      </div>
    );
  }
}