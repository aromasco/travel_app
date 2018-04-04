import React, { Component } from 'react';
import MessageBoard from './MessageBoard';
import Itinerary from './Itinerary';
import NewEvent from './NewEvent';
import {jumbotron} from 'reactstrap';


const apiURL = 'http://localhost:3000'
class Trip extends Component {
  constructor(props){
    super(props)
    this.state = {
      trip: [],
      trip_id: '',
      active: false,
    }
    this.toggleComponent = this.toggleComponent.bind(this)
  }

  toggleComponent() {
    this.setState(prevState => ({active : !this.state.active}))
  }

  getTripId(){
    if (this.props.match.params.id === null) {
      return localStorage.getItem('trip_id')
    }
   else {
     localStorage.setItem('trip_id', this.props.match.params.id)
     return this.props.match.params.id
  }}

  componentWillMount(){

    // When the component mounts we want see if an object exists in local storage, if yes, load the object,
    //if not pull it from props.match.params.id and save it to local storage
    const tripID = {
      trip_id: this.getTripId()
    }

    this.setState({newEventStatus: false})

    fetch(`${apiURL}/find_trip`,
      {
        body: JSON.stringify(tripID),
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST"
      }
    )
    .then((rawResponse) =>{
      return rawResponse.json()
    })
    .then((parsedResponse) =>{
      this.setState({trip: parsedResponse})
      console.log('trip', this.state.trip)
    })
    this.setState({trip_id: tripID.trip_id})
  }

  render() {
    return(
      <div>
        <jumbotron>
          <h2>{this.state.trip.title} <br/></h2>
          <h5>{this.state.trip.start_date} to {this.state.trip.end_date} <br/>
          {this.state.trip.city}, {this.state.trip.state} {this.state.trip.country} <br/>
          {this.state.trip.description} </h5> <br />
        </jumbotron>
      <div className="MessageBoard">
        <MessageBoard />
      </div>
      <div className="toggle-form">
        {this.state.active && <NewEvent />}
        <button type="button" onClick={this.toggleComponent.bind(this)}>
          toggle
        </button>
      </div>
        <Itinerary />
      </div>
    )
  }
}

export default Trip;
