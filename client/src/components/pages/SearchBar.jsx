import React, { Component } from "react";
import winesApi from "../../winesApi";
import WineBottle from "../WineBottle";
import {
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
  FormGroup,
  Label
} from "reactstrap";
import api from '../../api'

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      food: "",
      wines: [],
      isLoading: false,
      wineDetail: null,
      maxPrice: 1000,
      minRating: 0.7
    };
  }
  handleInputChange(stateFieldName, event) {
    this.setState({
      [stateFieldName]: event.target.value
    });
  }
  handleGetGeneralWines(e) {
    e.preventDefault()
    this.setState({
      wines: [],
      isLoading: true,
      wineDetail: null
    })
    //get the wine types recommendation
    winesApi.getWinesGeneral(this.state.food)
      .then(result => {
        this.setState({
          isLoading: false,
          wines: result.pairedWines
        });
        let foodData = {
          name: this.state.food,
          pairedWines:result.pairedWines,
          pairingText: result.pairingText,
        } 
        //save the result in our database
        if(result.pairedWines.length > 0){
          let promises = []
          result.pairedWines.forEach(wine => {
            promises.push(winesApi.getWineReccomendation(wine))
          })
            Promise.all([
              api.postFood(foodData),
              promises
            ])
              .then(res => console.log("results from our promises", res))
              .catch(err => console.log(err))
        }
      })
      .catch(err => this.setState({ message: err.toString() }));
  }
  handleBottleClick(e, name) {
    e.preventDefault();
    this.setState({
      wineDetail: null,
      isLoading: true
    });

    api
      .getWinesDetail(name,this.state.maxPrice, this.state.minRating)
      .then(result => {
        console.log("result wine detail", result);
        this.setState({
          isLoading: false,
          wineDetail: result.data
        });
      })
      .catch(err => this.setState({ message: err.toString() }));
  }
  

  render() {
    return (
      <div className="container">
        FILTERS:
        <InputGroup className="SearchInputGroup">
          <InputGroupAddon addonType="prepend">
            <Button
              color="primary"
              onClick={e => this.handleGetGeneralWines(e)}
            >
              <i className="fas fa-search" />
            </Button>
          </InputGroupAddon>
          <Input
            placeholder="Food"
            type="text"
            value={this.state.food}
            onChange={e => {
              this.handleInputChange("food", e);
            }}
          />
        </InputGroup>
        <FormGroup>
          <Label for="maxPrice">Max Price: </Label>
          <Input
            type="number"
            value={this.state.maxPrice}
            name="maxPrice"
            onChange={e => {
              this.handleInputChange("maxPrice", e);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="maxPrice">Min Rating: </Label>
          <Input
             type="number"
             name="minRating"
             value={this.state.minRating}
             placeholder="insert a value between 0 and 1"
             onChange={e => {
               this.handleInputChange("minRating", e);
             }}
          />
        </FormGroup>
        
        {this.state.wines && (
          <div className="winePicks">
            <h1>Out top picks: </h1>

            {this.state.wines.map((wine, i) => (
            
              <WineBottle
                key={i}
                onBottleClick={e =>
                  this.handleBottleClick(e, this.state.wines[i])
                }
                name={wine}
              />
            ))}
          </div>
        )}
        {this.state.isLoading && <div>LOADING...</div>}
        {this.state.wineDetail && (
          <div>
            <h1> Details:</h1>
            {this.state.wineDetail.map((wine, i) => (
              <li className="wineList" key={i}>
                <h1>name: {wine.title}</h1> <br />
                <img
                  className="wine-image-detail"
                  src={wine.imageUrl}
                  alt=""
                />{" "}
                <br />
                <h3>description: {wine.description}</h3> <br />
                <h1>price: {wine.price}</h1>
                <div className="Rating">
                <h3>Rating:</h3>
                {wine.averageRating*5 >= 0.5 ? '★' : '☆'}
                {wine.averageRating*5 >= 1.5 ? '★' : '☆'}
                {wine.averageRating*5 >= 2.5 ? '★' : '☆'}
                {wine.averageRating*5 >= 3.5 ? '★' : '☆'}
                {wine.averageRating*5 >= 4.5 ? '★' : '☆'}
              </div>
                <a href={wine.link}>buy on amazon</a>
              </li>
            ))}
          </div>
        )}
      </div>
    );
  }
}
