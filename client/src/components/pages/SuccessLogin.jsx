import React, { Component } from 'react'
import api from '../../api';

export default class SuccessLogin extends Component {
  render() {
    return (
      <div>
        <h1>Success!</h1>
        <p>You are being redirected to your profile in a second</p>
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
