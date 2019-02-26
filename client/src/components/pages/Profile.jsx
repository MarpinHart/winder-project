import React, { Component } from 'react'

export default class Profile extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: '',
    }
  }
  render() {
    return (
      <div className="Profile">
        {this.state.username}
      </div>
    )
  }
  componentDidMount(){
  this.setState({
    username: localStorage.getItem('user').username
  })
  }
}
