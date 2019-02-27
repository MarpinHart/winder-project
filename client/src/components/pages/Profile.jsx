import React, { Component } from "react";
import api from "../../api";
import {
  Button,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  Input
} from "reactstrap";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      id: ""
    };
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log(e.target.value)
  }
  handleSubmit(e) {
    e.preventDefault();
    api.editName(this.state.id, this.state.name);
  }
  render() {
    return (
      <div className="Profile">
        <h1>{this.state.name}</h1>
        <h2>{this.state.email}</h2>
        <Form className="ProfileForm">
        <h1>Change your name:</h1>
          <FormGroup row>
            <InputGroup>
              <InputGroupAddon addonType="prepend">Name</InputGroupAddon>
              <Input placeholder={this.state.name} onChange={e=>this.handleChange(e)}/>
            </InputGroup>
            <Button color="primary" className="CenterButton" onClick={e => this.handleSubmit(e)}>
              Submit
            </Button>
          </FormGroup>
        </Form>
      </div>
    );
  }
  componentDidMount() {
    this.setState({
      // Turns the data of the user into JavaScript Object
      id: JSON.parse(localStorage.getItem("user"))._id,
      name: JSON.parse(localStorage.getItem("user")).name,
      email: JSON.parse(localStorage.getItem("user")).email
    });
  }
}
