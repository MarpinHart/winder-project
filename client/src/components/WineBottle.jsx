import React, { Component } from 'react'
import { Button } from 'reactstrap'

export default class WineBottle extends Component {
  render() {
    return (
      <div className="wine-bottle-page"><img className="wine-image" src="https://www.manoswine.com/media/catalog/product/cache/1/image/790bb9cb46c431c1e54dab150582a452/c/u/custom_bottle3/www.manoswine.com-customized-bottle-33.jpg" alt=""/>
          <h1 className="wine-grape-name">{this.props.name}</h1>
          <Button onClick={this.props.onBottleClick} color="secondary">Select</Button>
      </div>
    )
  }
}
