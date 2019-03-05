import React, { Component } from 'react'

export default class ReadMore extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      expanded: false,
    }; 
    this.handleExpandedText= this.handleExpandedText.bind(this)
  }
  handleExpandedText(e) {
    e.preventDefault()
    this.setState(prevState=> ({
      expanded: !prevState.expanded,
    }))
  };
  render() {
    return (
      <p className="wine-bottle-description">
      {this.state.expanded ? this.props.description+' ' : this.props.description.slice(0, 200)+'... ' }
        <a className="read-more" onClick={e=> this.handleExpandedText(e)} href="">Read {this.state.expanded ? 'less' : 'more'} </a>
      </p>
    )
  }
}
