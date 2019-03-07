import React, { Component } from "react";
import winesApi from "../../winesApi";
import WineCarousel from "../WineCarousel";
import Autosuggest from "react-autosuggest";
import WineList from "../pages/WineList";
import StarRatingComponent from "react-star-rating-component";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/lab/Slider";

import {
  InputGroup,
  InputGroupAddon,
  Button,
  FormGroup,
  Label,
  Spinner,
  Form,
  Row,
  Col
} from "reactstrap";
import api from "../../api";
let foods = [];
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : foods.filter(
        food => food.toLowerCase().slice(0, inputLength) === inputValue
      );
};
const getSuggestionValue = suggestion => suggestion;
const renderSuggestion = suggestion => <div>{suggestion}</div>;
export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      food: "",
      wines: [],
      pairingText: "",
      isLoading: false,
      wineDetail: null,
      maxPrice: 150,
      minRating: 3,
      savedWines: [],
      value: "",
      suggestions: []
    };
  }
  handleInputChange(stateFieldName, event) {
    this.setState({
      [stateFieldName]: event.target.value
    });
  }
  handleChange = (event, value) => {
    this.setState({ maxPrice: value });
  };

  onChange = (event, { newValue }) => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.setState({
      value: newValue.toLowerCase(),
      food: newValue.toLowerCase()
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
  onStarClick(nextValue, prevValue, name) {
    this.setState({ minRating: nextValue });
  }

  handleGetGeneralWines(e) {
    e.preventDefault();
    this.setState({
      wines: [],
      isLoading: true,
      wineDetail: null
    });
    //ask for wines paired with the food in our database
    api
      .getPairedWines(this.state.food)
      .then(result => {
        //if there are no paired wines in our DB, get it from the API
        if (!result.data) {
          winesApi
            .getWinesGeneral(this.state.food)
            .then(result => {
              this.setState({
                isLoading: false,
                wines:
                  result.pairedWines === undefined ||
                  result.pairedWines.length === 0 ||
                  result.status === "failure"
                    ? "nothing"
                    : result.pairedWines,
                pairingText: result.pairingText
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
          // if the food is already in our DB, just set state to the results
          this.setState({
            isLoading: false,
            wines:
              result.data.pairedWines.length === 0 ||
              result.data.pairedWines === undefined
                ? "nothing"
                : result.data.pairedWines,
            pairingText: result.data.pairingText
          });
        }
      })
      .then(result => {
        if (this.state.wines.length > 0) {
          api
            .getWinesDetail(
              this.state.wines[0],
              this.state.maxPrice,
              this.state.minRating / 5 - 0.1
            )
            .then(result => {
              this.setState({
                isLoading: false,
                wineDetail: result.data
              });
            })
            .catch(err => this.setState({ message: err.toString() }));
        }
      });
  }

  handleBottleChange(name) {
    this.setState({
      wineDetail: null,
      isLoading: true
    });
    api
      .getWinesDetail(name, this.state.maxPrice, this.state.minRating / 5 - 0.1)
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
    api
      .getFoods("?allfoods=yes")
      .then(result => {
        foods = result.data;
      })
      .catch(err => console.log(err));
  }
  handleSaveWine(e, _wine) {
    e.preventDefault();
    api.postSavedWine(_wine).then(result => {
      this.setState(prevState => ({
        savedWines: [...prevState.savedWines, result.data._wine]
      }));
    });
  }

  handleDeleteSavedWine(e, wine, idx) {
    let array = [...this.state.savedWines].filter(item => {
      return item.toString() !== wine.toString();
    });
    this.setState({
      savedWines: array
    });
  }
  onKeyPress = e => {
    if (e.key === "Enter") {
      this.handleGetGeneralWines(e);
    }
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "What are you going to eat?",
      value,
      onChange: this.onChange,
      onKeyPress: this.onKeyPress
    };

    return (
      <div>
        {this.state.food === "" && this.state.wines.length === 0 && (
          <div className="main-bg" />
        )}
        <div className="container">
          {this.state.food === "" && this.state.wines.length === 0 && (
            <div className="welcomeText">
              <h1>
                Tell us what you are going to eat today and let us recommend the
                perfect wine!
              </h1>
            </div>
          )}
          <InputGroup className="SearchInputGroup">
            <InputGroupAddon addonType="prepend">
              <Button
                color="primary"
                onClick={e => this.handleGetGeneralWines(e)}
              >
                <i className="fas fa-search" />
              </Button>
            </InputGroupAddon>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
            />
          </InputGroup>

          {this.state.food.length > 0 && (
            <Form>
              <Row form>
                <Col md={6} xs={6}>
                  <FormGroup className="mr-5">
                    <Typography id="label">
                      Max Price <strong>{this.state.maxPrice}€</strong>{" "}
                    </Typography>
                    <Slider
                      min={10}
                      max={150}
                      value={parseInt(this.state.maxPrice)}
                      aria-labelledby="label"
                      onChange={this.handleChange}
                      className="mt-2 mr-5"
                      step={1}
                    />
                  </FormGroup>
                </Col>
                <Col md={6} xs={6}>
                  <FormGroup>
                    <Label for="minRating">Min Rating: </Label>
                    <StarRatingComponent
                      name="minRating"
                      starCount={5}
                      value={this.state.minRating}
                      onStarClick={this.onStarClick.bind(this)}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          )}
          {!this.state.isLoading && this.state.wines === "nothing" && this.state.pairingText==="" && (
            <div>
              {" "}
              <h1> No recommendations found </h1>{" "}
            </div>
          )}
          {!this.state.isLoading && this.state.wines === "nothing" && (
            <div>
              {" "}
              <p> {this.state.pairingText} </p>{" "}
            </div>
          )}

          <div className="carousel-result">
            <div classnName="wine-carousel">
              {this.state.wines.length > 0 && this.state.wines !== "nothing" && (
                <div className="wine-bottles-container">
                  <h1>Try these wines: </h1>
                  <div className="winePicks">
                    <WineCarousel
                      onBottleChange={(e, name) =>
                        this.handleBottleChange(e, name)
                      }
                      wines={this.state.wines}
                    />
                  </div>
                </div>
              )}
            </div>
            {this.state.isLoading && (
              <div data-aos="fade-right" className="spinner-loading-div">
                <Spinner className="spinner-loading" />
              </div>
            )}
            <div className="wine-list-component">
              {this.state.wineDetail && (
                <div>
                  <hr />
                  {this.state.wineDetail.map((wine, i) => (
                    <WineList
                      key={i}
                      content={wine}
                      delete={e => this.handleDeleteSavedWine(e, wine._id, i)}
                      save={e => this.handleSaveWine(e, wine._id)}
                      isSaved={
                        this.state.savedWines.includes(wine._id) ? true : false
                      }
                      isProfile={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
