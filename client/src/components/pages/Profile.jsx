import React, { Component } from "react";
import api from "../../api";
import WineList from "../WineList";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      savedWines: []
    };
  }

  handleDeleteSavedWine(e, wine, idx) {
    let array = [...this.state.savedWines].filter(item => {
      return item._id.toString() !== wine.toString();
    });
    this.setState({
      savedWines: array
    });
  }

  render() {
    return (
      <div>
        <div className="upperProfile">
          <img
            className="profileIcon mx-auto"
            src="/images/wineIcon.png"
            alt="profile"
          />
          <h1>Welcome, {this.state.name}!</h1>
        </div>
        {this.state.savedWines.length > 0 && (
          <div className="profile-wines-h2-flex">
            <h2>Your wine collection:</h2>
          <div className="profile-wines">
            {this.state.savedWines &&
              this.state.savedWines.map((wine, i) => (
                <WineList
                  key={i}
                  content={wine}
                  onDelete={e => this.handleDeleteSavedWine(e, wine._id, i)}
                  isSaved={true}
                  isProfile={true}
                />
              ))}
          </div>
        </div>
        )}
      </div>
    );
  }
  componentDidMount() {
    Promise.all([
      api.getUser(this.props.match.params.id),
      api.getSavedWinesByUser()
    ])
    .then(([user, savedWines]) => {
      let array = savedWines.data.map(w => ({
        ...w._wine,
        isLiked: w.isLiked,
        idSaving: w._id
      }));
      this.setState({
        name: user.name,
        savedWines: array
      });
    });
  }
}
