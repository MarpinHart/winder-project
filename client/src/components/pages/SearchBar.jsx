import React, { Component } from 'react'
import api from '../../api';

export default class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      food: "",
      wines: [],
      
      
    }
  }
  handleInputChange(stateFieldName, event) {
  
    // let newState = {}
    // newState[stateFieldName] = event.target.value

    // this.setState(newState)
    this.setState({
      [stateFieldName]: event.target.value
    })
    
  }
  handleClick(e) {
    e.preventDefault()
    api.getWinesGeneral(this.state.food)
      .then(result => {
        console.log('RESULT',result)
        this.setState({
          
          wines: result.data.pairedWines
        })
      })
      .catch(err => this.setState({ message: err.toString() }))
  }
  render() {
    console.log(this.props)
    return (
      <div>
      FOOD: <input type="text" value={this.state.food} onChange={(e) => { this.handleInputChange("food", e) }} /> 
            <button onClick={(e) => this.handleClick(e)}>Search</button>
           {this.state.wines? <div>
              <h1>list of wines:</h1> 
              {this.state.wines.map((wine, i)=> <li key={i}>{wine}</li> )}
              </div> :
              '' } 
      </div>
    )
  }
}
