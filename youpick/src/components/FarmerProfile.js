//import { faAudioDescription, faThList } from '@fortawesome/free-solid-svg-icons';
//import { data } from 'jquery';
import React, { Component, useEffect, useState } from 'react';
import SimpleMap from './SimpleMap';
import ReactDOM from 'react-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import DateTimePicker from 'react-datetime-picker';
//import Geocode from 'react-geocode';
//import { Link } from 'react-router-dom';
import './Farmer.css';

export class FarmerProfile extends Component {
    constructor(props) {
        super(props);
        this.state = { isHome: true, isReservations: false, isUpdateFarm: false, isCurrentCrops: false};
    }

    showHomeBox(){
        this.setState({ isHome: true, isReservations: false, isUpdateFarm: false, isCurrentCrops: false});
    }

    showReservationsBox (){
        this.setState({ isHome: false, isReservations: true, isUpdateFarm: false, isCurrentCrops: false});
    }

    showUpdateFarmBox(){
        this.setState({ isHome: false, isReservations: false, isUpdateFarm: true, isCurrentCrops: false});
    }

    showCurrentCropsBox(){
        this.setState({ isHome: false, isReservations: false, isUpdateFarm: false, isCurrentCrops: true});
    }

    getFarmEmail(){
        if(this.state.userInfo !== undefined)
            return this.state.userInfo.email;
    }
    getFarmName(){
        if(this.state.farmInfo !== undefined)
            return this.state.farmInfo[0].name;
    }

    //"Jack Nickolson" : 5f96f55aee32c737589337de
    //"Adam Farmington" : 5f973ec27dcd233db71a7494
    componentDidMount(){
        var that = this;
        Promise.all([
            fetch('/api/userinfo?user_id=5f96f55aee32c737589337de', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        ]).then(function (responses) {
            // Get a JSON object from each of the responses
            return Promise.all(responses.map(function (response) {
                return response.json();
            }));
        }).then(function (data) {
            that.setState({ userInfo: data[0] });
            that.handleFarmInfo();
        }).catch(function (error) {
            // if there's an error, log it
            console.log(error);
        });
    }

    handleMapInfo = async e => {
        var that = this;
        Promise.all([
            fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + that.state.farmInfo[0].address + '&key=AIzaSyBpnmQYRSrKreXGiNtzQJEb-gUiZiBL4TU')
        ]).then(function (responses) {
            // Get a JSON object from each of the responses
            return Promise.all(responses.map(function (response) {
                return response.json();
            }));
        }).then(function (data) {
            var points = [];
            //other test points for DC
            var point2 = {lat:38.8953941, lng:-77.041661, text:"Point 2"}
            var point3 = {lat:38.8954351, lng:-77.0334569, text:"Point 3"}
            points = [point2, point3]
            ReactDOM.render(<SimpleMap center={{lat: data[0].results[0].geometry.location.lat, lng: data[0].results[0].geometry.location.lng}} zoom={14} name={that.state.farmInfo[0].name} otherPoints={points}/>, document.getElementById("map-div"));
        }).catch(function (error) {
            // if there's an error, log it
            console.log(error);
        });
    };

    handleFarmInfo = async e => {
        if(this.state.userInfo !== undefined){
            var that = this;
            var farmId = this.state.userInfo.farm;
            Promise.all([
                fetch('/api/farm?farm_id=' + farmId, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            ]).then(function (responses) {
                // Get a JSON object from each of the responses
                return Promise.all(responses.map(function (response) {
                    return response.json();
                }));
            }).then(function (data) {
                //console.log(data);
                that.setState({ farmInfo: data[0] });
                that.setState({ farmId: data[0].farm_id})
                that.handleMapInfo();
                that.handleProduceInfo();
                that.handleEventsInfo();
            }).catch(function (error) {
                // if there's an error, log it
                console.log(error);
            });
        }
    };

    //apple 5fb1a2838092f73aeef6ea1b
    //banana 5fb1a29c8092f73aeef6ea1c
    handleProduceInfo = async e => {
        if(this.state.farmInfo !== undefined){
            var that = this;
            var farmId = this.state.userInfo.farm;
            fetch('/api/produce?farm_id=' + "5fa1946f3c6a6d3b837adc1c")
                .then(response => {
                if(response.ok) return response.json();
                throw new Error(response.statusText)  // throw an error if there's something wrong with the response
                })
                .then(function handleData(data) {
                    //console.log(data, "API CALL");
                    //that.setState({ eventData: data });
                }) 
                .catch(function handleError(error) {
                    console.log(error);
                }) 
            
        }
            
    };

    handleEventsInfo = async e => {
        if(this.state.farmInfo !== undefined){
            var that = this;
            var farmId = this.state.userInfo.farm;
            //console.log(farmId)
            fetch('/api/event?farm_id=' + "5f96f55aee32c737589337de")
                .then(response => {
                if(response.ok) return response.json();
                throw new Error(response.statusText)  // throw an error if there's something wrong with the response
                })
                .then(function handleData(data) {
                    //console.log(data, "API CALL");
                    that.setState({ eventData: data });
                }) 
                .catch(function handleError(error) {
                    console.log(error);
                }) 
            
        }
    };


    addProduce = async e => {
        e.preventDefault();
        const response = await fetch('/api/produce', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: this.state.prodName, description: this.state.prodDesc }),
        });
        const body = await response.text();
        this.setState({ responseToPost: body });
    };

    isOwnFarm() {
        var follow = document.getElementById("followButton");
        var message = document.getElementById("messageButton");
        if(follow !== null && message !== null){
            if (this.state.farmId === this.state.userInfo.user_id) {
                follow.style.display = "none";
                message.style.display = "none";
            } else {
                follow.style.display = "block";
                message.style.display = "block";
            }
        }
    };

    pause(){
        var html = document.getElementById("fullDoc");
        if(html !== null)
            setTimeout(() => {html.style.display = "block"}, 50);
            //onLoad={this.pause()} id="fullDoc" style={{display:"none"}}
    }

    render() {
        return (
            <div>
                <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css"></link>
                <link href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'/>
                <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet"></link>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
                <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
                <div className="container">
                    <div className="row profile">
                        <div className="col-md-3 border">
                            <div className="profile-sidebar">
                                <div className="profile-userpicc">
                                    <img src="https://k48b9e9840-flywheel.netdna-ssl.com/wp-content/uploads/2020/04/COVID-19-Relief_Small-Farms--1024x614.jpg" className="img-responsive" alt="" />
                                </div>
                                <div className="profile-usertitle">
                                    <div className="profile-usertitle-farmname">
                                        {this.getFarmName()}
                                    </div>
                                    <div className="profile-usertitle-farmemail">
                                        {this.getFarmEmail()}
                                    </div>
                                </div>
                                <div onLoad={this.isOwnFarm()} className="profile-userbuttons">
                                    <button type="button" className="btn btn-success btn-sm" id="followButton">Follow</button>
                                    <button type="button" className="btn btn-danger btn-sm" id="messageButton">Message</button>
                                </div>
                                <div className="profile-usermenu">
                                    <ul className="nav">
                                        <li className="active">
                                            <a href="#home" onClick={this.showHomeBox.bind(this)}>
                                            <i className="glyphicon glyphicon-home"></i>
                                            Home </a>
                                        </li>
                                        <li>
                                            <a href="#reservations" onClick={this.showReservationsBox.bind(this)}>
                                            <i className="glyphicon glyphicon-calendar"></i>
                                            Events </a>
                                        </li>
                                        <li>
                                            <a href="#update" onClick={this.showUpdateFarmBox.bind(this)}>
                                            <i className="glyphicon glyphicon-upload"></i>
                                            Update Farm </a>
                                        </li>
                                        <li>
                                            <a href="#crops" onClick={this.showCurrentCropsBox.bind(this)}>
                                            <i className="glyphicon glyphicon-grain"></i>
                                            Current Products </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={this.addProduce} style={{display:"none"}}>
                            <div>
                                <label>prod name</label>
                                <input type="text" id="name" value={this.props.prodName} onChange={e => this.setState({ prodName: e.target.value })}></input>
                                <label>prod desc</label>
                                <input type="text" id="desc" value={this.props.prodDesc} onChange={e => this.setState({ prodDesc: e.target.value })}></input>
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                        <div className="col-md-9">
                            <div className="active-selection-content">
                            {this.state.isHome && <HomeBox userInfo={this.state.userInfo} farmInfo={this.state.farmInfo}/>}
                            {this.state.isReservations && <ReservationsBox farmInfo={this.state.farmInfo} eventData={this.state.eventData}/>}
                            {this.state.isUpdateFarm && <UpdateFarmBox data={this.state.farmInfo}/>}
                            {this.state.isCurrentCrops && <CurrentCropsBox produceInfo={this.state.produceInfo}/>}
                            
                            </div>
                        </div>
                    </div>
                </div>
                <div id="map-div">
                </div>
            </div>
        )
    }
}

class HomeBox extends React.Component  {

    constructor(props) {
        super(props);
        this.state = { };
    }

    getFirstName(){
        if(this.props.userInfo !== undefined && document.getElementById("saveButton") !== null && document.getElementById("saveButton").style.display === "none")
            return this.props.userInfo.f_name;
    }
    getLastName(){
        if(this.props.userInfo !== undefined && document.getElementById("saveButton") !== null && document.getElementById("saveButton").style.display === "none")
            return this.props.userInfo.l_name;
    }
    getFarmEmail(){
        if(this.props.userInfo !== undefined && document.getElementById("saveButton") !== null && document.getElementById("saveButton").style.display === "none")
            return this.props.userInfo.email;
    }
    getFarmName(){
        if(this.props.farmInfo !== undefined && document.getElementById("saveButton") !== null && document.getElementById("saveButton").style.display === "none")
            return this.props.farmInfo[0].name;
    }
    getFarmAddress(){
        if(this.props.farmInfo !== undefined && document.getElementById("saveButton") !== null && document.getElementById("saveButton").style.display === "none")
            return this.props.farmInfo[0].address;
    }
    getFarmDescription(){
        if(this.props.farmInfo !== undefined && document.getElementById("saveButton") !== null && document.getElementById("saveButton").style.display === "none")
            return this.props.farmInfo[0].description;
    }

    render(){
        return(
            <div>
                <div className="col-xl-8 order-xl-1">
                <div className="card bg-secondary shadow">
                    <div className="card-header bg-white border-0">
                    <div className="row align-items-center">
                        <div className="col-8">
                            <h3 className="mb-0">My account</h3>
                        </div>
                        <div className="col-4 text-right">
                        <EditProfilePopup userInfo={this.props.userInfo}/>
                        </div>
                    </div>
                    </div>
                    <div className="card-body">
                    <form>
                        <h6 className="heading text-muted mb-4">User information</h6>
                        <div className="pl-lg-4">
                        <div className="row">
                            <div className="col-lg-6">
                            <div className="form-group focused">
                                <label className="form-control-label">Farm Name</label>
                                <input type="text" id="input-farmname" className="form-control form-control-alternative" placeholder="Farm Name" value={this.getFarmName()} readOnly></input>
                            </div>
                            </div>
                            <div className="col-lg-6">
                            <div className="form-group">
                                <label className="form-control-label">Email address</label>
                                <input type="email" id="input-email" className="form-control form-control-alternative" placeholder="Farm Email" value={this.getFarmEmail()} readOnly></input>
                            </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6">
                            <div className="form-group focused">
                                <label className="form-control-label">First name</label>
                                <input type="text" id="input-first-name" className="form-control form-control-alternative" placeholder="First name" value={this.getFirstName()} readOnly></input>
                            </div>
                            </div>
                            <div className="col-lg-6">
                            <div className="form-group focused">
                                <label className="form-control-label">Last name</label>
                                <input type="text" id="input-last-name" className="form-control form-control-alternative" placeholder="Last name" value={this.getLastName()} readOnly></input>
                            </div>
                            </div>
                        </div>
                        </div>
                        <hr className="my-4"></hr>
                        <h6 className="heading text-muted mb-4">Farm information</h6>
                        <div className="pl-lg-4">
                        <div className="row">
                            <div className="col-md-12">
                            <div className="form-group focused">
                                <label className="form-control-label">Address</label>
                                <input id="input-address" className="form-control form-control-alternative" placeholder="Farm Address" value={this.getFarmAddress()} type="text" readOnly></input>
                            </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                            <div className="form-group focused">
                                <label className="form-control-label">Farm description</label>
                                <input type="text" id="input-description" className="form-control form-control-alternative" placeholder="Description" value={this.getFarmDescription()} readOnly></input>
                            </div>
                            </div>
                        </div>
                        </div>
                        <a href="#!" className="btn btn-sm btn-success" id="saveButton" style={{display: "none"}}> Save Changes</a>
                        <a href="#!" className="btn btn-sm btn-danger" id="cancelButton" style={{display: "none"}}>Cancel Changes</a>
                    </form>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

class ReservationsBox extends React.Component  {

    constructor(props) {
        super(props);
        this.state = { };
    }
    eventsToTable(){
        if(document.getElementById('table-content') !== null){
            //console.log(this.props.eventData);
            var html = ' <tbody>';
            for(var i = 0; i < this.props.eventData.length; i++){
                let date = new Date(this.props.eventData[i].event_time);
                //console.log(date.toDateString());
                html += '<tr> <th scope="row">' + this.props.eventData[i].name + '</th> <td>' + this.props.eventData[i].description + '</td> <td>' + date.toDateString() + '</td> <td>' + this.props.eventData[i].attendance_count + '</td> <td>' + this.props.eventData[i].max_people + '</td> <td>' + this.props.eventData[i].max_people_per_group + '</td> <td id="row' + i + '"> </td> </tr>';
            }
            html += '</tbody>';
            document.getElementById('table-content').innerHTML = html;
            
            for(var i = 0; i < this.props.eventData.length; i++){
                ReactDOM.render(<EditEventPopup event={this.props.eventData[i]}/>, document.getElementById("row" + i));
            }

            ReactDOM.render(<CreateNewEvent farmInfo={this.props.farmInfo}/>, document.getElementById("NewEventButton"));

        }
    }

    getFarmEvents = async e => {
        const response = await fetch('/api/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ farmId: this.props.farmInfo.farm_id}),
        });
        const body = await response.text();
        //console.log(body, "EVENTS");
        this.setState({ farmEvents: body });
      };

    createNewEvent = async e => {
        e.preventDefault();
        const response = await fetch('/api/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ farmId: this.state.farmId,  eventTime: this.state.eventTime}),
        });
        const body = await response.text();
        
        this.setState({ responseToPost: body });
      };

    render(){
        return(
            <div>
                <table class="table"> 
                    <thead> 
                        <tr> 
                            <th scope="col">Name</th> 
                            <th scope="col">Description</th> 
                            <th scope="col">Time</th> 
                            <th scope="col">Attendance</th> 
                            <th scope="col">Max People</th> 
                            <th scope="col">Max Per Group</th> 
                            <th scope="col" id="NewEventButton"> </th> 
                        </tr> 
                    </thead> 
                    <tbody id="table-content" onLoad={this.eventsToTable()}>
                        
                    </tbody>
                </table>
                <p>{this.state.response}</p>
                <p>{this.state.farmEvents}</p>
            </div>
        );
    }
}

class UpdateFarmBox extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {  };
    }
    render(){
        return(
            <div>
                <div>Update Farm Box</div>
                <p>{JSON.stringify(this.props.data)}</p>
            </div>
        );
    }
}

class CurrentCropsBox extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {};
    }

    cropsToTable(){
        if(document.getElementById('table-content') !== null){
            var html = '<table class="table"> <thead> <tr> <th scope="col">Name</th> <th scope="col">Description</th> </tr> </thead> <tbody>';
            for(var i = 0; i < Object.keys(this.props.produceInfo).length; i++){
                html += '<tr> <th scope="row">' + this.props.produceInfo[i].name + '</th> <td>' + this.props.produceInfo[i].description + '</td> </tr>';
            }
            if(Object.keys(this.props.produceInfo).length === 0)
                html += '<tr> <th scope="row"> Currently no produce </th> <td> </td> </tr>';
            html += '</tbody> </table>';
            document.getElementById('table-content').innerHTML = html;
        }
    }

    createNewProduct = async e => {
        e.preventDefault();
        const response = await fetch('/api/produce', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: this.state.farmId,  description: this.state.eventTime}),
        });
        const body = await response.text();

        this.setState({ responseToPost: body });
      };

    render(){
        return(
            <div>
                <div id="table-content" onLoad={this.cropsToTable()}>
                </div>       
            </div>
        );
    }
}

function EditProfilePopup(props) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleUpdate = () => {
        updateEvent(props);
        setShow(false);
    
    };

    //1600 Pennsylvania Avenue NW, Washington, DC 20500
    //1 Apple Park WayCupertino, CA 95014
    async function updateEvent(props) {
        var addressVal = document.getElementById('input-address-update').value;
        var descriptionVal = document.getElementById('input-description-update').value;
        console.log(addressVal, descriptionVal)
        const response = await fetch('/api/farm', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ farm_id: "5fa1946f3c6a6d3b837adc1c", address: addressVal, description: descriptionVal}),
        });
        const body = await response.text();
        window.location.reload(true);
        
    };
  
    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          Edit
        </Button>
  
        <Modal show={show} onHide={handleClose} style={{opacity:1, paddingTop:'70px'}} aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Farm Settings</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
                <h6 className="heading text-muted mb-4">Farm information</h6>
                <div className="pl-lg-4">
                <div className="row">
                    <div className="col-md-12">
                    <div className="form-group focused">
                        <label className="form-control-label">Address</label>
                        <input id="input-address-update" className="form-control form-control-alternative" placeholder="Farm Address" type="text"></input>
                    </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                    <div className="form-group focused">
                        <label className="form-control-label">Farm description</label>
                        <input type="text" id="input-description-update" className="form-control form-control-alternative" placeholder="Description" ></input>
                    </div>
                    </div>
                </div>
                </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
          <a href="#!" className="btn btn-sm btn-success" id="saveButton" style={{display: "none"}}> Save Changes</a>
                        <a href="#!" className="btn btn-sm btn-danger" id="cancelButton" style={{display: "none"}}>Cancel Changes</a>
        </Modal>
      </>
    );
  }

  function EditEventPopup(props) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleDelete = () => {
        deleteEvent(props);
        setShow(false);
    
    };

    const handleUpdate = () => {
        updateEvent(props);
        setShow(false);
    
    };

    async function deleteEvent(props) {
        const response = await fetch('/api/event', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ event_id: props.event._id}),
        });
        const body = await response.text();
        window.location.reload(true);
        
    };

    async function updateEvent(props) {
        var eventName = document.getElementById('input-name').value;
        var eventDescription = document.getElementById('input-description').value;
        var maxPeople = document.getElementById('input-max-people').value;
        var maxPerGroup = document.getElementById('input-max-per-group').value;
        const response = await fetch('/api/event', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ event_id: props.event._id, name: eventName, description: eventDescription, max_people: maxPeople, max_people_per_group: maxPerGroup}),
        });
        const body = await response.text();
        window.location.reload(true);
        
    };

    return (
      <>
        <Button variant="danger" onClick={handleShow}>
          Edit
        </Button>
  
        <Modal show={show} onHide={handleClose} style={{opacity:1, paddingTop:'70px'}} aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Event Settings</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
                <h6 className="heading text-muted mb-4">Reservation Information</h6>
                <div className="pl-lg-4">
                    <div className="row">
                        <div className="col-lg-6">
                        <div className="form-group focused">
                            <label className="form-control-label">New Name</label>
                            <input type="text" min="1" id="input-name" className="form-control form-control-alternative" placeholder="Name" ></input>
                        </div>
                        </div>
                        <div className="col-lg-6">
                        <div className="form-group focused">
                            <label className="form-control-label">New Description</label>
                            <input type="text" min="1" id="input-description" className="form-control form-control-alternative" placeholder="Description"></input>
                        </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                        <div className="form-group focused">
                            <label className="form-control-label">New Max People</label>
                            <input type="number" id="input-max-people" className="form-control form-control-alternative" placeholder="Max People"></input>
                        </div>
                        </div>
                        <div className="col-lg-6">
                        <div className="form-group focused">
                            <label className="form-control-label">New Max Per Group</label>
                            <input type="number" id="input-max-per-group" className="form-control form-control-alternative" placeholder="Max Per Group"></input>
                        </div>
                        </div>
                    </div>
                </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="success" onClick={handleUpdate}>
              Save Changes
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Event
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }


function CreateNewEvent(props) {

const [value, onChange] = useState(new Date(1616313600000));
const [show, setShow] = useState(false);

const handleClose = () => setShow(false);
const handleShow = () => setShow(true);

const handleSaved = () => {
    newEvent(props);
    setShow(false);

};



async function newEvent(props) {
    var eventName = document.getElementById('input-eventname').value;
    var eventDescription = document.getElementById('input-eventdiscription').value;
    var maxPeople = document.getElementById('input-max').value;
    var maxPerGroup = document.getElementById('input-max-per-group').value;
    var eventDate = (value.getTime() / 1000).toFixed(0);
    var produceArr = [];
    //console.log(props.farmInfo[0]._id, eventName, eventDescription, maxPeople, maxPerGroup, eventDate, produceArr);
    const response = await fetch('/api/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ farm_id: "5f96f55aee32c737589337de",  name: eventName, description: eventDescription,
                             max_people: maxPeople, max_people_per_group: maxPerGroup, produce: produceArr,
                             event_time: eventDate * 1000}),
    });
    const body = await response.text();
    window.location.reload(true);
};

return (
    <>
    <Button variant="success" onClick={handleShow}>
        New Event
    </Button>

    <Modal show={show} onHide={handleClose} style={{opacity:1, paddingTop:'70px'}} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
        <Modal.Title>Create A New Farm Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form id="new-event-form">
            <h6 className="heading text-muted mb-4">Event information</h6>
            <div className="pl-lg-4">
            <div className="row">
                <div className="col-lg-6">
                <div className="form-group focused">
                    <label className="form-control-label">Event Name</label>
                    <input type="text" id="input-eventname" className="form-control form-control-alternative" placeholder="Event Name" ></input>
                </div>
                </div>
                <div className="col-lg-6">
                <div className="form-group">
                    <label className="form-control-label">Event Description</label>
                    <input type="email" id="input-eventdiscription" className="form-control form-control-alternative" placeholder="Event Description" ></input>
                </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6">
                <div className="form-group focused">
                    <label className="form-control-label">Max Number of People</label>
                    <input type="number" min="1" id="input-max" className="form-control form-control-alternative" placeholder="Max Number of People" ></input>
                </div>
                </div>
                <div className="col-lg-6">
                <div className="form-group focused">
                    <label className="form-control-label">Max Number of People per Group</label>
                    <input type="number" min="1" id="input-max-per-group" className="form-control form-control-alternative" placeholder="Max Number of People per Group"></input>
                </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6">
                <div className="form-group focused">
                    <label className="form-control-label">Event Time</label>
                        <DateTimePicker onChange={onChange} value={value} />
                </div>
                </div>
                <div className="col-lg-6">

                </div>
            </div>
            </div>
        </form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Close
        </Button>
        <Button variant="primary" onClick={handleSaved}>
            Create Event
        </Button>
        </Modal.Footer>
        <a href="#!" className="btn btn-sm btn-success" id="saveButton" style={{display: "none"}}> Save Changes</a>
                    <a href="#!" className="btn btn-sm btn-danger" id="cancelButton" style={{display: "none"}}>Cancel Changes</a>
    </Modal>
    </>
);
}


export default FarmerProfile
