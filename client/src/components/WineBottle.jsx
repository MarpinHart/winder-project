import React, { Component } from 'react'

export default class WineBottle extends Component {
  render() {
    return (
      <div><img className="wine-image" src="https://www.manoswine.com/media/catalog/product/cache/1/image/790bb9cb46c431c1e54dab150582a452/c/u/custom_bottle3/www.manoswine.com-customized-bottle-33.jpg" alt=""/>
          <h1>{this.props.name}</h1>
          <button onClick={this.props.onBottleClick}></button>
      </div>
    )
  }
}
