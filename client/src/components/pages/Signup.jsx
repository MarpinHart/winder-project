import React, { Component } from 'react';
import api from '../../api';
import {Button, Label, Input, Form, FormGroup, Container,FormFeedback } from 'reactstrap';

export default class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      name: "",
      password: "",
      message: null
    }
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleClick(e) {
    e.preventDefault()
    let data = {
      email: this.state.email,
      name: this.state.name,
      password: this.state.password,
    }
    api.signup(data)
      .then(result => {
        console.log('SUCCESS!')
        this.props.history.push("/") // Redirect to the home page
      })
      .catch(err => this.setState({ message: err.toString() }))
  }

  isEmailCorrect() {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(this.state.email).toLowerCase());
  }

  isPasswordStrong(){
    return this.state.password.length >= 6
  }

  render() {
    return (
      <div className="Signup">
        <Container>
          <Form>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input 
                value={this.state.email} 
                onChange={this.handleInputChange} 
                valid={this.isEmailCorrect()}
                invalid={this.state.email.length > 0 && !this.isEmailCorrect()}
                type="email"
                name="email"
                id="exampleEmail"
                placeholder="alice@gmail.com" />
                {/* The feedback is displayed when the input is valid */}
              <FormFeedback valid></FormFeedback>
              {/* The feedback is displayed when the input is invalid */}
              <FormFeedback>This is not a valid email</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input 
                value={this.state.name} 
                onChange={this.handleInputChange} 
                type="text"
                name="name"
                placeholder="Alice Doe" />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input 
                value={this.state.password} 
                onChange={this.handleInputChange} 
                valid={this.isPasswordStrong()}
                invalid={this.state.password.length > 0 && !this.isPasswordStrong()}
                type="password"
                name="password"/>
                {/* The feedback is displayed when the input is valid */}
              <FormFeedback valid>Password is strong enough</FormFeedback>
              {/* The feedback is displayed when the input is invalid */}
              <FormFeedback>Password is not strong enough</FormFeedback>
            </FormGroup>
            <FormGroup>
              {/* Renders: */}
              {/* <button class="btn btn-outline-primary">Enter</button> */}
              <Button 
                color="primary" 
                disabled={!this.isEmailCorrect() || !this.isPasswordStrong()}
                onClick={(e) => this.handleClick(e)}>
                Sign up
              </Button>
            </FormGroup>
          </Form>
          <br/>
          {this.state.message && <div className="info info-danger">
            {this.state.message}
          </div>}
        </Container>
      </div>
    );
  }
}