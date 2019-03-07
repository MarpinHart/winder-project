import React, { Component } from "react";
import { Navbar, NavbarBrand, Nav, NavItem } from "reactstrap";
import { Route, Link, NavLink, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import api from "../api";
import Profile from "./pages/Profile";
import SuccessLogin from "./pages/SuccessLogin";
import AOS from "aos";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: []
    };
  }

  handleLogoutClick(e) {
    api.logout();
  }

  render() {
    return (
      <div className="App">
        <link
          href="https://unpkg.com/aos@2.3.1/dist/aos.css"
          rel="stylesheet"
        />
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js" />
        <link
          href="https://fonts.googleapis.com/css?family=Playfair+Display"
          rel="stylesheet"
        />
        {/* Search Icon link for the SearchBar page */}
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.7.2/css/all.css"
          integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr"
          crossOrigin="anonymous"
        />
        <Navbar color="light" light>
          <NavbarBrand href="/">
            <img src="/images/wine.png" alt="" />
          </NavbarBrand>
          <Nav className="justify-content-end">
            <NavItem>
              {!api.isLoggedIn() && <NavLink to="/signup">Signup</NavLink>}
            </NavItem>
            <NavItem>
              {!api.isLoggedIn() && <NavLink to="/login">Login</NavLink>}
            </NavItem>
            <NavItem>
              {api.isLoggedIn() && (
                <Link
                  to={
                    "/profile/" + JSON.parse(localStorage.getItem("user"))._id
                  }
                >
                  Profile
                </Link>
              )}
            </NavItem>
            <NavItem>
              {api.isLoggedIn() && (
                <Link to="/" onClick={e => this.handleLogoutClick(e)}>
                  Logout
                </Link>
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
            <Route path="/success-login" component={SuccessLogin} />
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
