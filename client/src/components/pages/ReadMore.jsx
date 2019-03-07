import React, { Component } from "react";

export default class ReadMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    this.handleExpandedText = this.handleExpandedText.bind(this);
  }
  handleExpandedText(e) {
    e.preventDefault();
    this.setState(prevState => ({
      expanded: !prevState.expanded
    }));
  }
  render() {
    if (this.props.description) {
      return (
        <p className="wine-bottle-description">
          {this.props.description && this.state.expanded
            ? this.props.description + " "
            : this.props.description.slice(0, 100) + "... "}
          <a
            className="read-more"
            onClick={e => this.handleExpandedText(e)}
            href=""
          >
            Read {this.state.expanded ? "less" : "more"}{" "}
          </a>
        </p>
      );
    }
    return (
      <p className="wine-bottle-description">
        Marvin e' un bravo bambino ma il suo sogno di diventare la meglio
        mignotta di Roma e' sbagliato, dovrebbe puntare piu in alto e diventare
        la meglio figa d'Europa.
      </p>
    );
  }
}
