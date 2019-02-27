import React, { Component } from 'react'
import api from '../../api';

export default class Profile extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',
    }
  }
  handleChange(e){
    this.setState({
     [e.target.name] : e.target.value 
    })
  }
  handleSubmit(e){
    e.preventDefault()
    api.editName(this.state.id,this.state.name)
  }
  render() {
    console.log(this.state.id,this.state.name)
    return (
      <div className="Profile">
      <input name="name" type="text" placeholder={this.state.name} onChange={e => this.handleChange(e)}/>
      <button onClick={e=>this.handleSubmit(e)}>Submit</button>
      </div>
    )
  }
  componentDidMount(){
  this.setState({
    // Turns the data of the user into JavaScript Object
    id: JSON.parse(localStorage.getItem('user'))._id,
    name: JSON.parse(localStorage.getItem('user')).name
  })
  }
}
