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
        console.log("checking result", result);
        this.setState({
          rooms: [...this.state.rooms, result.body]
        });
      })
      .catch(error => console.log(error));
    this.setState({
      roomName: ""
    });
  };
  // paginate = ()=> seCurrentPage()
  handleClick = event => {
    this.setState({
      currentPage: Number(event.target.id)
    });
  };

  render() {
    console.log("state", this.state);
    const { rooms, currentPage, roomsPerPage } = this.state;
    console.log("currentPage", currentPage);
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(rooms.length / roomsPerPage); i++) {
      pageNumbers.push(i);
    }
    console.log("pageNumbers", pageNumbers);

    // if(!this.state.rooms) return 'Loading'
    console.log("rooms in state", this.state.rooms);
    return (
      <React.Fragment>
        <div>
          <form onSubmit={this.onSubmit}>
            <input
              type="text"
              name="roomName"
              value={this.state.roomName}
              onChange={this.onChange}
            ></input>
            <button type="submit">Add Room</button>
          </form>
          {currentRooms.map((room, index) => {
            return (
              <ul key={index}>
                <Link to={`/game/${room.id}`}>{room.roomName}</Link>
              </ul>
            );
          })}
          <p>List of page numbers</p>
          {pageNumbers.map(number => {
            return (
              <nav className="pagination">
                <ul key={number} onClick={this.handleClick}>
                  {number}
                </ul>
              </nav>
            );
          })}
          {/* <div className="container">
            <ul className="pagination">
                {pageNumbers.map(number => {
                    return <li key={number} id={number} onClick={this.handleClick}>
                       <a >{number}</a>
                    </li>
                })
                }
            </ul>
          </div> */}
          {/* <nav>{renderPageNumbers}</nav> */}
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