import React, { Component } from 'react'
import api from '../../api';

export default class SuccessLogin extends Component {
  render() {
    return (
      <div>
        <h1>Login Successfull</h1>
        <p>You are going to be redirected to your profile</p>
      </div>
    )
  }
  componentDidMount() {
    api.getConnectedProfile()
      .then(user => {
        setTimeout(() => {
          // Redirect the user the "/profile"
          this.props.history.push('/profile/'+user._id)
        }, 2000)
      })
  }
}
