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
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }
  handleChange(e) {
    this.setState({
      name: e.target.value
    });
  }

  handleClick(e) {
    e.preventDefault()
    api.editName(this.state.id, this.state.name)
      .then(res=>res)

  }

  render() {
    return (
      // <div className="Profile container">
      //  <div className="upperProfile">
      //   <img className="profileIcon" src="/images/wineIcon.png" alt="profile"/>
      //   <div className="info-box">

      //    <h3><strong>Name: </strong>{this.state.name}</h3>
      //    <h5><strong>E-mail: </strong>{this.state.email}</h5>
      //    </div>
      //  </div>
      //  <div className="Profile container">
        <div className="upperProfile">
          <img className="profileIcon" src="/images/wineIcon.png" alt="profile"/>
          <Form>
            <FormGroup row>
              <InputGroup>
                <InputGroupAddon addonType="prepend">Name</InputGroupAddon>
                <Input name='name' value={this.state.name} onChange={e=>this.handleChange(e)}/>
                <InputGroupAddon addonType="append">
                  <Button onClick={e => this.handleClick(e)} color="success">Save
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>
            <FormGroup row>
              <InputGroup>
                <InputGroupAddon addonType="prepend">Email</InputGroupAddon>
                <Input name='email' editable={false} value={this.state.email}/>
              </InputGroup>
            </FormGroup>
          </Form> 
        </div>
        // </div>
      //  </div>
      // </div>
    );
  }
  componentDidMount() {
    api.getUser(this.props.match.params.id)
      .then(user =>{
        this.setState({
          id: user._id,
          name: user.name,
          email: user.email
        });
      })
  }
  
}
