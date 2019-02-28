import React, { Component } from "react";
import winesApi from "../../winesApi";
import WineBottle from "../WineBottle";

import {
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
  FormGroup,
  Label,
  Spinner
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
    winesApi.getWinesGeneral(this.state.food)

      .then(result => {
         console.log('result.data.pairedWines',result)
        this.setState({
          isLoading: false,
          wines: result.pairedWines
        });
        let foodData = {
          name: this.state.food,
          pairedWines:result.pairedWines,
          pairingText: result.pairingText,
        } 
        console.log("foodData", foodData)
        api.postFood(foodData)
          .then(res =>res)
          .catch(err => console.log(err))
      })
      .catch(err => this.setState({ message: err.toString() }));
  }
  handleBottleClick(e, name) {
    e.preventDefault();
    this.setState({
      wineDetail: null,
      isLoading: true
    });

    winesApi
      .getWineReccomendation(name, this.state.maxPrice, this.state.minRating)
      .then(result => {
        console.log("result", result);
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
            onChange={e => {
              this.handleInputChange("maxPrice", e);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="maxPrice">Min Rating: </Label>
          <Input
             type="number"
             value={this.state.minRating}
             placeholder="insert a value between 0 and 1"
             onChange={e => {
               this.handleInputChange("minRating", e);
             }}
          />
        </FormGroup>
        
        {this.state.wines && (
          <div className="wine-bottles-container">
        <h1>Out top picks: </h1>
          <div className="winePicks">

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
          </div>
        )}
        {this.state.isLoading && <div><Spinner style={{ width: '5rem', height: '5rem' }} /></div>}
        {this.state.wineDetail && (
          <div>
            <h1> Details:</h1>
            <hr/>
            {this.state.wineDetail.recommendedWines.map((wine, i) => (
              <div className="wineList" key={i}>
                <h5 className="wine-bottle-name">name: {wine.title}</h5> <br />
                <img
                  className="wine-bottle-image"
                  src={wine.imageUrl}
                  alt=""
                />{" "}
                <br />
                <h6 className="wine-bottle-description">Pescription: {wine.description}</h6> <hr />
                <h4 className="wine-bottle-price">Price: {wine.price}</h4>
                <Button outline color="warning" href={wine.link}>Buy it on Amazon</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  componentDidUpdate() {
    console.log("componentDidUpdate");
  }
}
