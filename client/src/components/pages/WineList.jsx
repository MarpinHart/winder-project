import React, { Component } from "react";
import { Button } from "reactstrap";
import api from "../../api";



import ReadMore from "../pages/ReadMore";

export default class WineList extends Component {
  constructor(props) {
    super(props);
    this.state = { isLiked: null };
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

  
  handleLikeButton(e, type){
    if(type==="like"){
      if(this.state.isLiked){
        this.setState({isLiked: null});
        type=null
      }else{
        this.setState({isLiked: true});
      }
      
    }
    if(type==="dislike"){
      if(this.state.isLiked===false){
        this.setState({isLiked: null});
        type=null
      }else{
        this.setState({isLiked: false});
      }
      
    }
   
    api.likeWine(this.props.content.idSaving,type)
    .then(res=>res)
    .catch(err=> console.log(err))
  }
  
  componentDidMount() {
    if(this.props.isProfile){
      this.setState({isLiked: this.props.content.isLiked});
    }
  }

  render() {
    return (
      <div
        className="profile-list-container"
        data-aos="fade-right"
        aos-duration="500"
      >
        <img
          className="wine-bottle-image"
          src={this.props.content.imageUrl}
          alt=""
        />
        <div className="wine-name-description">
          <h5 className="wine-bottle-name">{this.props.content.title}</h5>

          <div
            className="wine-rating-price"
            data-aos="fade-left"
            aos-duration="500"
          >
            <h6 className="wine-bottle-price">{this.props.content.price}€</h6>

            <div className="Rating">
              {this.props.content.averageRating * 5 >= 0.5 ? (
                <i className="fas fa-star" />
              ) : (
                <i className="far fa-star" />
              )}
              {this.props.content.averageRating * 5 >= 1.5 ? (
                <i className="fas fa-star" />
              ) : (
                <i className="far fa-star" />
              )}
              {this.props.content.averageRating * 5 >= 2.5 ? (
                <i className="fas fa-star" />
              ) : (
                <i className="far fa-star" />
              )}
              {this.props.content.averageRating * 5 >= 3.5 ? (
                <i className="fas fa-star" />
              ) : (
                <i className="far fa-star" />
              )}
              {this.props.content.averageRating * 5 >= 4.5 ? (
                <i className="fas fa-star" />
              ) : (
                <i className="far fa-star" />
              )}
              <ReadMore description={this.props.content.description} />
              
            </div>
          </div>
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
              {this.props.isSaved && this.props.isProfile && 
              <div>
              <Button outline={!this.state.isLiked} color="primary"   onClick={e =>
                  this.handleLikeButton(e, "like")
                }><i className="fas fa-thumbs-up"></i></Button>
              <Button outline={this.state.isLiked || this.state.isLiked===null } color="primary"  onClick={e =>
                this.handleLikeButton(e, "dislike")
                }><i className="fas fa-thumbs-down"></i></Button>
                </div>
              
              }
            </div> </div>
      </div>
    );
  }
}
