import React, { Component } from 'react'

export default class ReadMore extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      expanded: false,
    }; 
    this.handleExpandedText= this.handleExpandedText.bind(this)
  }
  handleExpandedText() {
    this.setState(prevState=> ({
      expanded: !prevState.expanded,
    }))
  };
  render() {
    return (
      <p className="wine-bottle-description">
      {this.state.expanded ? this.props.params.description : this.props.params.description.splice(0,200) }
        <a onClick={this.handleExpandedText()}> Read more </a>
        
      </p>
    )
  }
}
