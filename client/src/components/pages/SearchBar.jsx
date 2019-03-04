import React, { Component } from "react";
import winesApi from "../../winesApi";
import WineCarousel from "../WineCarousel";
import WineList from '../pages/WineList'

import {
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
  FormGroup,
  Label,
  Spinner
} from "reactstrap";
import api from "../../api";

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      food: "",
      wines: [],
      isLoading: false,
      wineDetail: null,
      maxPrice: 1000,
      minRating: 0.7,
      savedWines: []
    };
  }
  handleInputChange(stateFieldName, event) {
    this.setState({
      [stateFieldName]: event.target.value
    });
  }
  handleGetGeneralWines(e) {
    e.preventDefault();
    this.setState({
      wines: [],
      isLoading: true,
      wineDetail: null
    });
    api.getPairedWines(this.state.food).then(result => {
      if (!result.data) {
        //get the wine types recommendation
        winesApi
        .getWinesGeneral(this.state.food)
        .then(result => {
          this.setState({
            isLoading: false,
            wines: result.pairedWines
          });
          let foodData = {
            name: this.state.food,
            pairedWines: result.pairedWines,
            pairingText: result.pairingText
          };
          //save the result in our database
          if (result.pairedWines.length > 0) {
            let promises = [];
            result.pairedWines.forEach(wine => {
              promises.push(winesApi.getWineReccomendation(wine));
            });
            Promise.all([api.postFood(foodData), promises])
            .then(res => res)
            .catch(err => console.log(err));
          }
        })
        .catch(err => this.setState({ message: err.toString() }));
      } else {
        this.setState({
          isLoading: false,
          wines: result.data.pairedWines
        });
      }
    });
  }
  handleBottleClick(e, name) {
    e.preventDefault();
    this.setState({
      wineDetail: null,
      isLoading: true
    });
    
    api
    .getWinesDetail(name, this.state.maxPrice, this.state.minRating)
    .then(result => {
      this.setState({
        isLoading: false,
        wineDetail: result.data
      });
    })
    .catch(err => this.setState({ message: err.toString() }));
  }
  componentDidMount() {
    api.getSavedWinesByUser("?getOnlyId=true").then(result => {
      this.setState({
        savedWines: result.data
      });
    });
  }
  handleSaveWine(e, _wine) {
    e.preventDefault();
    api.postSavedWine(_wine)
      .then(result => {
        this.setState(prevState => ({
          savedWines: [...prevState.savedWines, result.data._wine]
        }));
      })
      .catch(err => console.log(err));
  }
  handleDeleteSavedWine(e, wine,idx){
    let array = [...this.state.savedWines].filter(item => {
      return item.toString() !== wine.toString()
    })
    this.setState({
        savedWines: array
      })
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
          <div className="wine-bottles-container">
            <h1>Our top picks: </h1>
            <div className="winePicks">
              {this.state.wines.length > 0 && (
                <WineCarousel
                  onBottleClick={(e, name) => this.handleBottleClick(e, name)}
                  wines={this.state.wines}
                />
              )}
            </div>
          </div>
        )}
        {this.state.isLoading && (
          <div data-aos="fade-right" className="spinner-loading-div">
            <Spinner className="spinner-loading" />
          </div>
        )}
        {this.state.wineDetail && (
          <div>
            <h1> Details:</h1>
            <hr />
            {this.state.wineDetail.map((wine, i) => (
              <WineList 
                key={i} 
                content={wine} 
                delete={e => this.handleDeleteSavedWine(e,wine._id,i)}
                save={e => this.handleSaveWine(e,wine._id)}
                isSaved={this.state.savedWines.includes(wine._id) ? true : false} />
            ))}
          </div>
        )}
      </div>
    );
  }
}


// const parallaxData = [
//   {
//     start: 0,
//     end: 500,
//     properties: [
//       {
//         startValue: 1,
//         endValue: 2,
//         property: 'scale',
//       },
//     ],
//   },
// ];

// class Example extends Component {
//   render() {
//     return (
//       <Plx
//         className='MyAwesomeParallax'
//         parallaxData={ parallaxData }
//       >
//         /* Your content */
//       </Plx>
//     );
//   }
// }
