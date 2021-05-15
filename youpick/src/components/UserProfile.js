import React, { Component } from 'react'
import SimpleMap from './SimpleMap';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export class UserProfile extends Component {
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
    handleUserInfo = async e => {
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
      };

    handleMapInfo = async e => {
        navigator.geolocation.getCurrentPosition(function(position) {
            var points = [];
            var point2 = {lat:39.5096442, lng:-84.7424136, text:"Farm #1"}
            var point3 = {lat:39.5124772, lng:-84.7308768, text:"Farm #2"}
            points = [point2, point3];
            ReactDOM.render(<SimpleMap center={{lat: position.coords.latitude, lng: position.coords.longitude}} zoom={14} name="Your Location" otherPoints={points}/>, document.getElementById("map-div"));
        },
        function(error) {
          ReactDOM.render(<NoLocationService />, document.getElementById("map-div"));
          console.error("Error Code = " + error.code + " - " + error.message);
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
                that.setState({ farmInfo: data[0] });
                that.setState({ farmId: data[0].farm_id})
                that.handleMapInfo();
                that.handleProduceInfo();
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
            var produce = this.state.farmInfo[0].produce;

                var produceArr = [];
                for(var i = 0; i < Object.keys(produce).length; i++){
                    fetch('/api/produce?produce_id=' + produce[i])
                        .then(response => {
                        if(response.ok) return response.json();
                        throw new Error(response.statusText)  // throw an error if there's something wrong with the response
                        })
                        .then(function handleData(data) {
                            produceArr.push(data);
                            //console.log(data);
                        }) 
                        .catch(function handleError(error) {
                            console.log(error);
                        }) 
                }
                this.setState({ produceInfo: produceArr })
            
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
                <div onLoad={this.handleUserInfo} className="container">
                    <div className="row profile">
                        <div className="col-md-3 border">
                            <div className="profile-sidebar">
                                <div className="profile-userpic">
                                    <img src="https://k48b9e9840-flywheel.netdna-ssl.com/wp-content/uploads/2020/04/COVID-19-Relief_Small-Farms--1024x614.jpg" className="img-responsive" alt=""></img>
                                </div>
                                <div className="profile-usertitle">
                                    <div className="profile-usertitle-farmname">
                                        My Account
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
                                            My Events </a>
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
                            {this.state.isReservations && <ReservationsBox farmInfo={this.state.farmInfo}/>}
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

    settingsToggle() {
        var save = document.getElementById("saveButton");
        var cancel = document.getElementById("cancelButton");
        if(save !== null && cancel !== null){
            if (save.style.display === "none") {
                save.style.display = "block";
                cancel.style.display = "block";
                document.getElementById('input-farmname').readOnly = false;
                document.getElementById('input-email').readOnly = false;
                document.getElementById('input-first-name').readOnly = false;
                document.getElementById('input-last-name').readOnly = false;
                document.getElementById('input-address').readOnly = false;
                document.getElementById('input-description').readOnly = false;
            } else {
                save.style.display = "none";
                cancel.style.display = "none";
                document.getElementById('input-farmname').readOnly = true;
                document.getElementById('input-email').readOnly = true;
                document.getElementById('input-first-name').readOnly = true;
                document.getElementById('input-last-name').readOnly = true;
                document.getElementById('input-address').readOnly = true;
                document.getElementById('input-description').readOnly = true;
            }
        }
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
                            <a href="#!" className="btn btn-sm btn-primary" id="editSettings" onClick={this.settingsToggle}>Edit Settings</a>
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
    reservationsToTable(){
        if(document.getElementById('table-content') !== null){
            var html = '<table class="table"> <thead> <tr> <th scope="col">Name</th> <th scope="col">Description</th> </tr> </thead> <tbody>';
            for(var i = 0; i < Object.keys(this.props.farmInfo[0].reservations).length; i++){
                html.concat('<tr> <th scope="row">', this.props.farmInfo[0].reservations[i], '</th> <td>', "TO DO: CALL API FOR RESERVATION INFO", '</td> </tr>');
            }
            if(Object.keys(this.props.farmInfo[0].reservations).length === 0)
                html += '<tr> <th scope="row"> Currently no reservations </th> <td> </td> </tr>';
            html += '</tbody> </table>';
            document.getElementById('table-content').innerHTML = html;
        }
    }

    render(){
        return(
            <div>
                <div id="table-content" onLoad={this.reservationsToTable()}>

                </div>       
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

    render(){
        return(
            <div>
                <div id="table-content" onLoad={this.cropsToTable()}>

                </div>       
            </div>
        );
    }
}

class NoLocationService extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {};
    }
  
    render(){
        return(
            <div>
              <br></br>
              <br></br>
              <br></br>
              <h1 style={{marginLeft:"20%", marginRight:"20%", backgroundColor:"white", paddingLeft:"7px", paddingRight:"7px", display: "inline-block", borderRadius:"25px"}}> Please Enable Location Services to See Farms Near You</h1>
              <ol style={{marginLeft:"35%", marginRight:"35%", backgroundColor:"white", borderRadius:"25px"}}>
                <li>On your computer, open Chrome.</li>
                <li>At the top right, click <b>More</b> (the three dots in the top left) and then <b>Settings</b>.</li>
                <li>Under <b>Privacy and security</b>  (on the left menu), click <b>Site settings</b>.</li>
                <li>Click <b>Location</b>.</li>
                <li>Find <b>YouPick</b> in the list and click on it.</li>
                <li>Click <b>Location</b> and change the option to <b>Allow</b> or <b>Ask</b>.</li>
              </ol>      
            </div>
        );
    }
  }

export default UserProfile
