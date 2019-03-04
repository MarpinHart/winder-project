import React, { Component } from "react";
import winesApi from "../../winesApi";
import WineCarousel from "../WineCarousel";
import Autosuggest from 'react-autosuggest';
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
let foods = [
  
  
];
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : foods.filter(food =>
    food.toLowerCase().slice(0, inputLength) === inputValue
  );
};
const getSuggestionValue = suggestion => suggestion;
const renderSuggestion = suggestion => (
  <div>
    {suggestion}
  </div>
);
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
      savedWines:[],
      value: '',
      suggestions: []
    };
  }
  handleInputChange(stateFieldName, event) {
    this.setState({
      [stateFieldName]: event.target.value
    });
  }
  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
      food: newValue
    });
  };
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  // handleSaveWine(e, _wine){
  //   e.preventDefault()
  //   console.log('handleSaveWine',_wine)
  //   api.postSavedWine(_wine)
  //   .then(result=>{
  //     console.log('result wine saved',result)
  //     this.setState(prevState=>({
  //       savedWines:[...prevState.savedWines, result.data._wine]
  //     }))
  //   })
  //   .catch(err=>console.log(err))
  // }
  // handleDeleteSaveWine(e, _wine){
  //   e.preventDefault()
   
  //   api.deleteSavedWineByUser(_wine)
  //   .then(result=>{
      
  //     let array = [...this.state.savedWines]
  //     array.splice(array.indexOf(result.data._wine),1)
  //     this.setState({
  //       savedWines:array
  //     })
  //     console.log('thisstate wine deleted',this.state)
  //   })
  //   .catch(err=>console.log(err))
  // }
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
    api.getFoods('?allfoods=yes')
    .then(result=>{
     foods=result.data
     console.log('foods cmponent',foods)

    })
    .catch(err=>console.log(err))
  }
  handleSaveWine(e, _wine) {
    e.preventDefault();
    api.postSavedWine(_wine)
      .then(result => {
        this.setState(prevState => ({
          savedWines: [...prevState.savedWines, result.data._wine]
        }));
      })
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
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Type a Food',
      value,
      onChange: this.onChange
    };

   
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
          {/* <Input
            placeholder="Food"
            type="text"
            value={this.state.food}
            onChange={e => {
              this.handleInputChange("food", e);
            }}
          /> */}
          <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
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
          <div className="spinner-loading-div">
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
              // <div className="container" key={i}>
              //   <h5 className="wine-bottle-name">{wine.title}</h5>{" "}
              //     <img
              //       className="wine-bottle-image"
              //       src={wine.imageUrl}
              //       alt=""
              //     />{" "}
              // <div className="wineList" >
              //   <div className="wine-name-description">
              //   <div className="wine-rating-price">
              //     <div className="Rating">
              //       <h6>Rating:</h6>
              //       {wine.averageRating * 5 >= 0.5 ? "★" : "☆"}
              //       {wine.averageRating * 5 >= 1.5 ? "★" : "☆"}
              //       {wine.averageRating * 5 >= 2.5 ? "★" : "☆"}
              //       {wine.averageRating * 5 >= 3.5 ? "★" : "☆"}
              //       {wine.averageRating * 5 >= 4.5 ? "★" : "☆"}
              //     </div>
              //     <h6 className="wine-bottle-price">Price: {wine.price}</h6>
              //     <Button outline color="warning" href={wine.link}>
              //       Buy it on Amazon
              //     </Button>
              //    {!this.state.savedWines.includes(wine._id)?<Button outline color="warning" onClick={e => this.handleSaveWine(e,wine._id)}>
              //       Save
              //     </Button>:<Button outline color="warning" onClick={e => this.handleDeleteSaveWine(e,wine._id)}>
              //       UNSAVE
              //     </Button>} 

              //   </div>
              //     <br />
              //     <p className="wine-bottle-description">
              //      {wine.description}
              //     </p>
              //   </div>

              //   </div>
              // </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
