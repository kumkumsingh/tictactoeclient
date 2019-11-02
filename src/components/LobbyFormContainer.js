import React, { Component } from "react";
import * as request from "superagent";
import { Link } from "react-router-dom";
import { logIn } from "../actions/login";
import { connect } from "react-redux";

class LobbyFormContainer extends Component {
  state = {
    rooms: [],
    roomName: "",
    currentPage: 1,
    roomsPerPage: 4
  };

  componentDidMount() {
    console.log("comp did mount");
    request
      .get("http://localhost:4000/lobby")
      .then(result => {
        console.log("result", result.body);
        this.setState({
          rooms: result.body
        });
      })
      .catch(error => console.log("error", error));
  }


  onChange = event => {
    this.setState({
      roomName: event.target.value
    });
    console.log("checking the state of roomname", this.state.roomName);
    //[event.target.name] = event.target.value
  };
  onSubmit = event => {
    event.preventDefault();
    console.log("onsumbmit of lobby room");
    const token = this.props.loggedIn;
    console.log("checking token", token);
    request
      .post("http://localhost:4000/lobby")
      .set("Authorization", `Bearer ${token}`)
      .send({ roomName: this.state.roomName })
      .then(result => {
          console.log('checking result',result)
          this.setState({
              rooms:[...this.state.rooms,result.body]
          })
      })
      .catch(error => console.log(error));
    this.setState({
      roomName: ""
    });
  }

  handleClick = (event) => {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }


  render() {
    console.log('state',this.state)
    const { rooms, currentPage, roomsPerPage } = this.state;
    console.log('currentPage',currentPage)
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom)
    console.log('curentrooms',currentRooms)
   
    console.log('roomsPerPage',roomsPerPage)
    
    //console.log('renderrooms',renderRooms)
      // Logic for displaying page numbers
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(rooms.length / roomsPerPage); i++) {
        pageNumbers.push(i);
      }
      console.log('pageNumbers',pageNumbers)
      const renderPageNumbers = pageNumbers.map(number => {
        return (
          <li
            key={number}
            id={number}
            onClick={this.handleClick}
          >
            {number}
          </li>
        );
      });
    // if(!this.state.rooms) return 'Loading'
    console.log("rooms in state",this.state.rooms)
    return (
        <React.Fragment>
      <div>
        {/* container of the lobby render db lobby */}
        
        {/* {this.state.rooms && this.state.rooms.map((gameRoom, index) => {
          return (
            <li key={index}>
              <Link to={`/game/${gameRoom.id}`}>{gameRoom.roomName}</Link>
            </li>
          );
        })} */}
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            name="roomName"
            value={this.state.roomName}
            onChange={this.onChange}
          ></input>
          <button type="submit">Add Room</button>
        </form>
        
           <p>List of page numbers</p>
         {  currentRooms.map((room, index) => {
            return <li key={index}><Link to={`/game/${room.id}`}>{room.roomName}</Link></li>
          })}
           {/* {renderRooms.map((room,index) => {

               return (
                   <ul key={index}>{room.props.roomName}</ul>
               )
           } )} */}
           {renderPageNumbers}
         {/* <ul>
            {renderRooms}
          </ul>
          <ul id="page-numbers">
            {renderPageNumbers}
          </ul> */}
        
      </div>
      </React.Fragment>
    );
  }
}
const mapStatesToProps = state => {
  return {
    loggedIn: state.user
  };
};
export default connect(
  mapStatesToProps,
  { logIn }
)(LobbyFormContainer);
