import React, { Component } from "react";
import { Button, Input } from "reactstrap";
import api from "../../api";
import StarRatingComponent from "react-star-rating-component";

import ReadMore from "../pages/ReadMore";

export default class WineList extends Component {
  constructor(props) {
    super(props);
    this.state = { rating: 0 };
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSaveWine(e, _wine, idx) {
    e.preventDefault();
    this.props.save(e, this.props.content._id, this.props.index);
  }

  handleDeleteSavedWine(e, _wine, idx) {
    e.preventDefault();
    this.props.delete(e, this.props.content._id, this.props.index);
    api
      .deleteSavedWineByUser(_wine)
      .then(res => res)
      .catch(err => console.log(err));
  }

  handleRateWine(e, idSaving, rating) {
    e.preventDefault();

    api
      .rateWine(idSaving, rating)
      .then(res => res)
      .catch(err => console.log(err));
  }
  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
    console.log("id saving", name);
    api
      .rateWine(name, nextValue)
      .then(res => res)
      .catch(err => console.log(err));
  }
  componentDidMount() {
    console.log("component did mount rating", this.props.content.rating);
    this.setState({ rating: this.props.content.rating });
  }

  render() {
    return (
      <div
        className="profile-list-container"
        data-aos="fade-right"
        aos-duration="500"
      >
        <h5 className="wine-bottle-name">{this.props.content.title}</h5>

        <div className="wine-name-description">
          <img
            className="wine-bottle-image"
            src={this.props.content.imageUrl}
            alt=""
          />

          <div
            className="wine-rating-price"
            data-aos="fade-left"
            aos-duration="500"
          >
            <h6 className="wine-bottle-price">
              Price: {this.props.content.price}€
            </h6>

            <div className="Rating">
              <h6>Rating:</h6>
              {this.props.content.averageRating * 5 >= 0.5 ? (
                <i class="fas fa-star" />
              ) : (
                <i class="far fa-star" />
              )}
              {this.props.content.averageRating * 5 >= 1.5 ? (
                <i class="fas fa-star" />
              ) : (
                <i class="far fa-star" />
              )}
              {this.props.content.averageRating * 5 >= 2.5 ? (
                <i class="fas fa-star" />
              ) : (
                <i class="far fa-star" />
              )}
              {this.props.content.averageRating * 5 >= 3.5 ? (
                <i class="fas fa-star" />
              ) : (
                <i class="far fa-star" />
              )}
              {this.props.content.averageRating * 5 >= 4.5 ? (
                <i class="fas fa-star" />
              ) : (
                <i class="far fa-star" />
              )}
            </div>
          </div>
        </div>
        <ReadMore description={this.props.content.description} />

        <div className="wine-buttons">
          <Button outline color="warning" href={this.props.content.link}>
            Order Online
          </Button>
          {!this.props.isSaved && (
            <Button
              outline
              color="warning"
              onClick={e => this.handleSaveWine(e, this.props.content._id)}
            >
              Save
            </Button>
          )}
          {this.props.isSaved && (
            <Button
              outline
              color="warning"
              onClick={e =>
                this.handleDeleteSavedWine(e, this.props.content._id)
              }
            >
              Delete
            </Button>
          )}
        </div>
        <div className="rate-yourself-container">
        <p className="rate-the-wine">Rate the wine:</p>
        {this.props.isSaved && this.props.isProfile && (
          <StarRatingComponent
            className="star-rating"
            name={this.props.content.idSaving}
            starCount={5}
            value={this.state.rating}
            onStarClick={this.onStarClick.bind(this)}
          />
        )}
        </div>
      </div>
    );
  }
}
