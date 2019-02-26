import React, { Component } from 'react'

export default class Profile extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: '',
    }
  }
  handleChange(e){
    this.setState({
     [e.target.name] : e.target.value 
    })
  }
  handleSubmit(e){
    e.preventDefault()
    this.setState({
      
    })
  }
  render() {
    console.log(this.state.user)
    return (
      <div className="Profile">
      <input name="user" type="string" placeholder={this.state.user} onChange={e => this.handleChange(e)}/>
      <button onClick={e=>this.handleSubmit(e)}>Submit</button>
      </div>
    )
  }
  componentDidMount(){
  this.setState({
    // Turns the data into JavaScript Object
    user: JSON.parse(localStorage.getItem('user')).username
  })
  }
}
