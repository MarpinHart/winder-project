import React, { Component } from "react";
import { Button } from "reactstrap";
import api from "../../api";

export default class WineList extends Component {
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

  render() {
    return (
      <div className="container">
        <h5 className="wine-bottle-name">{this.props.content.title}</h5>{" "}
        <div className="wineList">
          <div className="wine-name-description">
            <img
              className="wine-bottle-image"
              src={this.props.content.imageUrl}
              alt=""
            />{" "}
            <br />
            <p className="wine-bottle-description">
              {this.props.content.description}
            </p>
            <div className="wine-rating-price">
              <h6 className="wine-bottle-price">
                Price: {this.props.content.price}
              </h6>
              <div className="Rating">
                <h6>Rating:</h6>
                {this.props.content.averageRating * 5 >= 0.5 ? "★" : "☆"}
                {this.props.content.averageRating * 5 >= 1.5 ? "★" : "☆"}
                {this.props.content.averageRating * 5 >= 2.5 ? "★" : "☆"}
                {this.props.content.averageRating * 5 >= 3.5 ? "★" : "☆"}
                {this.props.content.averageRating * 5 >= 4.5 ? "★" : "☆"}
              </div>
              <Button outline color="warning" href={this.props.content.link}>
                Buy it on Amazon
              </Button>
              {!this.props.isSaved && <Button
                  outline
                  color="warning"
                  onClick={e =>
                    this.handleSaveWine(e, this.props.content._id)
                  }>
                  Save
                </Button>
              }
              {this.props.isSaved && <Button
                outline
                color="warning"
                onClick={e =>
                  this.handleDeleteSavedWine(e, this.props.content._id)
                }>
                Delete
              </Button>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
