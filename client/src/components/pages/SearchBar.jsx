import React, { Component } from 'react'
import winesApi from '../../winesApi';
import WineBottle from '../WineBottle'

export default class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      food: "",
      wines: [],
      isLoading:false,

      
      
    }
  }
  handleInputChange(stateFieldName, event) {
    this.setState({
      [stateFieldName]: event.target.value
    })
    
  }
  handleGetGeneralWines(e) {
    e.preventDefault()
    this.setState({
      wines: [],
      isLoading: true
    })
    winesApi.getWinesGeneral(this.state.food)
      .then(result => {
        
        this.setState({
          isLoading: false,
          wines: result.data.pairedWines
        })
      })
      .catch(err => this.setState({ message: err.toString() }))
  }
  handleBottleClick(e, name){
    e.preventDefault()
    console.log('e.target.name',e)

    winesApi.getWineReccomendation(name)

  }
  
  render() {
    console.log(this.props)
    return (
      <div>
      FOOD: <input type="text" value={this.state.food} onChange={(e) => { this.handleInputChange("food", e) }} /> 
            <button onClick={(e) => this.handleGetGeneralWines(e)}>Search</button>
           {this.state.wines && <div>
              <h1>list of wines:</h1> 
              
              {this.state.wines.map((wine, i)=> <WineBottle onBottleClick={(e)=>this.handleBottleClick(e, this.state.wines[i])} name={wine} /> )}
              </div> } 
           {this.state.isLoading && <div>LOADING...</div> }
      </div>
    )
  }
  componentDidUpdate(){
    
    
  }
}
