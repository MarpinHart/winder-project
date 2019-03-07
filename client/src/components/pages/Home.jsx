import React, { Component } from "react";
import SearchBar from "./SearchBar";
import api from "../../api";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";

export default class Home extends Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //   }
  // }
  render() {
    if (!api.isLoggedIn()) {
      return (
        <div>
          <div className="main-bg" />
          <Container>
            <div className="homepage">
              <h1>Welcome to Winder!</h1>
              <br />
              <h2>
                Got some food and don't know what wine to choose? <br />
                We are here to help!
              </h2>
              <br />
              <h5>
                <Link to="/signup">Sign up</Link> or{" "}
                <Link to="/login">log in</Link> to get a recommendation
              </h5>
            </div>
          </Container>
        </div>
      );
    } else {
      return (
        <div>
          <SearchBar />
        </div>
      );
    }
  }
}
