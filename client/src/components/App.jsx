import React, { Component } from "react";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import { Route, Link, NavLink as NLink, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import api from "../api";
import Profile from "./pages/Profile";
import AOS from "aos";

export default class App extends Component {
  handleLogoutClick(e) {
    api.logout();
  }

  render() {
    return (
      <div className="App">
        
        <Navbar color="light" light>
          <NavbarBrand tag={NLink} to="/">
            <img src="/images/wine.png" alt="" />
          </NavbarBrand>
          <Nav className="justify-content-end">
            <NavItem>
              {!api.isLoggedIn() && <NavLink tag={NLink} to="/signup">Signup</NavLink>}
            </NavItem>
            <NavItem>
              {!api.isLoggedIn() && <NavLink tag={NLink} to="/login">Login</NavLink>}
            </NavItem>
            <NavItem>
              {api.isLoggedIn() && (
                <NavLink 
                  tag={NLink}
                  to={
                    "/profile/" + JSON.parse(localStorage.getItem("user"))._id
                  }
                >
                  Profile
                </NavLink>
              )}
            </NavItem>
            <NavItem>
              {api.isLoggedIn() && (
                <NavLink tag={Link} to="/" onClick={e => this.handleLogoutClick(e)}>
                  Logout
                </NavLink>
              )}
            </NavItem>
          </Nav>
        </Navbar>
        <div className="main">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/profile/:id" component={Profile} />
            <Route exact path="/login" component={Login} />
            <Route render={() => <h2>404</h2>} />
          </Switch>
        </div>
      </div>
    );
  }
  componentDidMount() {
    AOS.init();
  }
}
