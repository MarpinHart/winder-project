import React, { Component } from 'react';
import SearchBar from './SearchBar';
import api from '../../api.js';
import {Container} from 'reactstrap';
import { Link } from 'react-router-dom';

export default class Home extends Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //   }
  // }
  render() { 
    if(!api.isLoggedIn()){
      return (
        <Container>
          <h2>Welcome to Winder</h2>
          <br/>
          <p>Got some food and don't know what wine to choose? <br/> 
          We are here to help!</p>
          <p>Just <Link to='/signup'>sign up</Link> or <Link to='/login'>log in</Link> to use Winder 🍷</p>
        </Container>
      );
    } else {
      return (
        <SearchBar />
      )
    }         
  }
}
