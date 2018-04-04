import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {ListGroup, ListGroupItem, Badge, Col} from 'reactstrap';
import '../css/MessageBoard.css';
import AuthService from '../services/AuthService'

const Auth = new AuthService()


class MessageBoard extends Component {

  constructor(props){
    super(props)
    this.state = {
      apiUrl: "http://localhost:3000",
      chats: [],
      error: '',
      form: {
        user_id: '',
        trip_id: '',
        message_text: ''
      }
      }
  }

  getTripId(){
    return localStorage.getItem('trip_id')
  }


  componentWillMount(){

    // grab user_id from JWT and trip_id from local localStorage
    const { form } = this.state
    form.user_id = Auth.getUserId()
    form.trip_id = localStorage.getItem('trip_id')
    fetch(`${this.state.apiUrl}/messages.json`)
    .then((rawResponse) =>{
      return rawResponse.json()
    })
    .then((parsedResponse) =>{
      this.setState(
        {chats: parsedResponse,
        form }
        )
    })

    const tripID = {
      trip_id: this.getTripId()
    }

  }

  handleChange(e){
    const { form } = this.state
    form.message_text = e.target.value
    this.setState({ form })
    console.log(this.state.form)
  }

  submitMessage(e){
    //TODO handle user_id and trip_id on form
    e.preventDefault()
    const newMessage = this.state.form
    fetch(`${this.state.apiUrl}/messages`,
      {
        body: JSON.stringify(newMessage),
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST"
      }
    )
    .then((rawResponse) => {
      console.log(rawResponse);
      return Promise.all([rawResponse.status, rawResponse.json()])
    })
    .then((parsedResponse) =>{  this.state.error
      if (parsedResponse[0] === 422) {
        this.setState({errors: 'Invalid Inputs'})
      } else {
        let chat = this.state.chats
        let newMes = {
          user_id:parsedResponse[1]['user_id'],
          trip_id:parsedResponse[1]['trip_id'],
          message:parsedResponse[1]['message']
        }
        console.log(newMes);
        chat.push(newMes)
        console.log(parsedResponse);
        this.setState({errors: null, chats: chat})
        this.render()
      }})
  }

  render() {
    return (
      <div className="message-board">
        <h3>Message Board</h3>
        <div className="chats" id="chats">
        <form className="input" onSubmit={this.submitMessage.bind(this)}>
          <input type="text" id="newsuggestion" className="col-form-label" placeholder=" Suggestions?" align="center" onChange={this.handleChange.bind(this)}/>
          <br /> <input type="submit" value="Submit" className="btn btn-secondary" id="newsuggestion2"/>
        </form>
        <br />
          {this.state.chats.map((chats, index) =>{
            return(
              <ListGroup sm={3} key={index}>
                <Col sm={6}>
                <ListGroupItem className="chatMessage">  <Badge pill>{chats.user_id}</Badge> {chats.message}</ListGroupItem>
                </Col>
              </ListGroup>
            )
          })}
          </div>
        </div>
      )
    }
  }




export default MessageBoard;
