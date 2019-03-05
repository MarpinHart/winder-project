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
import WineList from '../pages/WineList'

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      id: "",
      savedWines:[]
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
  handleDeleteSavedWine(e, wine,idx){
    let array = [...this.state.savedWines].filter(item => {
      return item._id.toString() !== wine.toString()
    })
    this.setState({
        savedWines: array
      })
  }

  render() {
    return (
        <div className="upperProfile">
          <img className="profileIcon" src="/images/wineIcon.png" alt="profile"/>
          <div className="info-box" data-aos="zoom-in">
          <h1>Welcome</h1>
          <Form>
            <FormGroup row>
              <InputGroup>
                <InputGroupAddon addonType="prepend">Name</InputGroupAddon>
                <Input name='name' value={this.state.name} onChange={e=>this.handleChange(e)}/>
                <InputGroupAddon addonType="append">
                  <Button onClick={e => this.handleClick(e)} color="primary">Save
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>
            <FormGroup row>
              <InputGroup>
                <InputGroupAddon addonType="prepend">Email</InputGroupAddon>
                <Input name='email' readOnly value={this.state.email}/>
              </InputGroup>
            </FormGroup>
          </Form> 
            </div>
            <div className="profile-wines">
            
            {this.state.savedWines.length>0 && <h1> Your wines:</h1>}
            <hr />
            {this.state.savedWines && 
            
            this.state.savedWines.map((wine, i) => (
                <WineList key={i} content={wine} delete={e => this.handleDeleteSavedWine(e,wine._id,i)} isSaved={true} />
            ))}
          </div>
              
            </div>
    );
  }
  componentDidMount() {
    Promise.all([
      api.getUser(this.props.match.params.id),
      api.getSavedWinesByUser()])
    
      .then(([user,savedWines]) =>{
        let array = savedWines.data.map(w=>w._wine)
        this.setState({
          id: user._id,
          name: user.name,
          email: user.email,
          savedWines: array
        });
      })
  }
}
