import React, { Component } from "react";
import api from "../../api";
import {
  Button,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  Input
} from "reactstrap";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      id: "",
      savedWines:[]
    };
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }
  handleChange(e) {
    this.setState({
      name: e.target.value
    });
  }

  handleClick(e) {
    e.preventDefault()
    api.editName(this.state.id, this.state.name)
      .then(res=>res)

  }
  handleDeleteSaveWine(e, _wine,idx){
    e.preventDefault()
   
    api.deleteSavedWineByUser(_wine)
    .then(result=>{
      
      let array = [...this.state.savedWines]
     array.splice(idx,1)
      this.setState({
        savedWines:array
      })
      console.log('thisstate wine deleted',this.state)
    })
    .catch(err=>console.log(err))
  }

  render() {
    return (
        <div className="upperProfile">
          <img className="profileIcon" src="/images/wineIcon.png" alt="profile"/>
          <div className="info-box">
          <h1>Welcome</h1>
          <Form>
            <FormGroup row>
              <InputGroup>
                <InputGroupAddon addonType="prepend">Name</InputGroupAddon>
                <Input name='name' value={this.state.name} onChange={e=>this.handleChange(e)}/>
                <InputGroupAddon addonType="append">
                  <Button onClick={e => this.handleClick(e)} color="primary">Save
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>
            <FormGroup row>
              <InputGroup>
                <InputGroupAddon addonType="prepend">Email</InputGroupAddon>
                <Input name='email' editable={false} value={this.state.email}/>
              </InputGroup>
            </FormGroup>
          </Form> 
            </div>
            <div className="saved-wines">
            <div>
            <h1> Details:</h1>
            <hr />
            {this.state.savedWines && this.state.savedWines.map((wine, i) => (
              <div className="container" key={i}>
                <h5 className="wine-bottle-name">{wine.title}</h5>{" "}
              <div className="wineList" >
                <div className="wine-name-description">
                  <img
                    className="wine-bottle-image"
                    src={wine.imageUrl}
                    alt=""
                  />{" "}
                  <br />
                  <p className="wine-bottle-description">
                   {wine.description}
                  </p>
                <div className="wine-rating-price">
                  <h6 className="wine-bottle-price">Price: {wine.price}</h6>
                  <div className="Rating">
                    <h6>Rating:</h6>
                    {wine.averageRating * 5 >= 0.5 ? "★" : "☆"}
                    {wine.averageRating * 5 >= 1.5 ? "★" : "☆"}
                    {wine.averageRating * 5 >= 2.5 ? "★" : "☆"}
                    {wine.averageRating * 5 >= 3.5 ? "★" : "☆"}
                    {wine.averageRating * 5 >= 4.5 ? "★" : "☆"}
                  </div>
                  <Button outline color="warning" href={wine.link}>
                    Buy it on Amazon
                  </Button>
                 <Button outline color="warning" onClick={e => this.handleDeleteSaveWine(e,wine._id,i)}>
                    UNSAVE
                  </Button> 

                </div>
                </div>

                </div>
              </div>
            ))}
          </div>
              
            </div>
        </div>
    );
  }
  componentDidMount() {
    Promise.all([
      api.getUser(this.props.match.params.id),
      api.getSavedWinesByUser()])
    
      .then(([user,savedWines]) =>{
        console.log('savedWines',savedWines)
        let array = savedWines.data
        array = array.map(w=>w._wine)
        console.log(array)

        this.setState({
          id: user._id,
          name: user.name,
          email: user.email,
          savedWines:array
        });
      })
  }
  
}
