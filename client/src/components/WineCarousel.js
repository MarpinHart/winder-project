import React, { Component } from "react";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators
} from "reactstrap";

class WineCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === this.props.wines.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
    this.props.onBottleChange(this.props.wines[nextIndex]);
  }

  previous() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === 0
        ? this.props.wines.length - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
    this.props.onBottleChange(this.props.wines[nextIndex]);
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    let wines;
    const { activeIndex } = this.state;

    wines = this.props.wines.map(
      wine => (wine = { name: wine, src: "/images/wine-bottle.png" })
    );
    const slides = wines.map((wine, i) => {
      return (
        <CarouselItem
          key={i}
          className="carouselImg"
          onExiting={this.onExiting}
          onExited={this.onExited}
        >
          <div className="wine-bottle">
            {/* <img src={wine.src} alt={wine.name} /> */}
            <p>{wine.name.toUpperCase()}</p>
          </div>
        </CarouselItem>
      );
    });

    return (
      <Carousel
        activeIndex={activeIndex}
        next={this.next}
        previous={this.previous}
        autoPlay={false}
        interval={false}
      >
        <CarouselIndicators
          items={wines}
          activeIndex={activeIndex}
          onClickHandler={this.goToIndex}
        />
        {slides}
        <CarouselControl
          direction="prev"
          directionText="Previous"
          onClickHandler={this.previous}
        />
        <CarouselControl
          direction="next"
          directionText="Next"
          onClickHandler={this.next}
        />
      </Carousel>
    );
  }
}

export default WineCarousel;
