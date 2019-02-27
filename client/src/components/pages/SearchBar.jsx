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
      wineDetail:null,
      maxPrice: 1000,
      minRating:0.7

      
      
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
      isLoading: true,
      wineDetail: null
    })
    winesApi.getWinesGeneral(this.state.food)

      .then(result => {
         console.log('result.data.pairedWines',result.data)
        this.setState({
          isLoading: false,
          wines: result.data.pairedWines
        })
      })
      .catch(err => this.setState({ message: err.toString() }))
  }
  handleBottleClick(e, name){
    e.preventDefault()
    this.setState({
      wineDetail: null,
      isLoading: true
    })

    winesApi.getWineReccomendation(name, this.state.maxPrice,this.state.minRating).then(result => {
        console.log('result',result)
      this.setState({
        isLoading:false,
        wineDetail: result.data
      })
    })
    .catch(err => this.setState({ message: err.toString() }))

  }
  
  render() {
    
    return (
      <div>
      FOOD: <input type="text" value={this.state.food} onChange={(e) => { this.handleInputChange("food", e) }} /> 
            <button onClick={(e) => this.handleGetGeneralWines(e)}>Search</button> <br/>
            FILTERS:
            <input type="number" value={this.state.maxPrice} onChange={(e) => { this.handleInputChange("maxPrice", e) }}/>
            <input type="number" value={this.state.minRating} placeholder="insert a value between 0 and 1" onChange={(e) => { this.handleInputChange("minRating", e) }}/>

           {this.state.wines && <div>
              <h1>list of wines:</h1> 
              
              {this.state.wines.map((wine, i)=> <WineBottle key={i} onBottleClick={(e)=>this.handleBottleClick(e,this.state.wines[i])} name={wine} /> )}
              </div> } 
           {this.state.isLoading && <div>LOADING...</div> }
           {this.state.wineDetail && <div>
             <h1>list specific wines:</h1>
             {this.state.wineDetail.recommendedWines.map((wine,i)=> <li key={i}>
               <h1>name: {wine.title}</h1> <br/>
               <img className='wine-image-detail' src={wine.imageUrl} alt=""/> <br/>
               <h3>description: {wine.description}</h3> <br/>
               <h1>price: {wine.price}</h1>
               <a href={wine.link}>buy on amazon</a>
               </li> )}
             </div> }
      </div>
    )
  }
  componentDidUpdate(){
    console.log('componentDidUpdate')
    
  }
}
