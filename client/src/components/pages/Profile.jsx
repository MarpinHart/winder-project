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
  }
  handleClick(e) {
    e.preventDefault()
    api.editName(this.state.id, this.state.name).then(res=>console.log(res))

  }

  render() {
    console.log(this.state.name)
    console.log(this.state.email)
    return (
      <div className="Profile container">
       <div className="upperProfile">
        <img className="profileIcon" src="/images/wineIcon.png" alt="profile"/>
        <div className="info-box">
         <h3><strong>Name: </strong>{this.state.name}</h3>
         <h5><strong>E-mail: </strong>{this.state.email}</h5>
         </div>
       </div>
        <Form className="ProfileForm" >
        <h1>Change your name:</h1>
          <FormGroup row>
            <InputGroup>
              <InputGroupAddon addonType="prepend">Name</InputGroupAddon>
              <Input name='name' placeholder={this.state.name} onChange={e=>this.handleChange(e)}/>
            </InputGroup>
            <Button onClick={e => this.handleClick(e)} color="primary" className="CenterButton">
              Submit
            </Button>
          </FormGroup>
        </Form>
      </div>
    );
  }
  componentDidMount() {
    api.getUser(this.props.match.params.id)
      .then(user =>{
        console.log('user', user)
        this.setState({
          id: user._id,
          name: user.name,
          email: user.email
        });
      })
  }
  
}
