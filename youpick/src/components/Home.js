import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom';
import SimpleMap from './SimpleMap';
import ReactDOM from 'react-dom';

export class Home extends Component {

    state = {
        response: '',
        post: '',
        responseToPost: ''
      };
      
      componentDidMount() {
        /*this.callApi()
          .then(res => this.setState({ response: res.express }))
          .catch(err => console.log(err));*/
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
      }
      
      callApi = async () => {
        /*const response = await fetch('/api/hello');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        
        return body;*/
      };
      
      handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch('/api/world', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ post: this.state.post }),
        });
        const body = await response.text();
        
        this.setState({ responseToPost: body });
      };

    render() {
        return (
            <Fragment>
                {/* <p>{this.state.response}</p>
                    <form onSubmit={this.handleSubmit}>
                    <p>
                        <strong>Post to Server:</strong>
                    </p>
                    <input
                        type="text"
                        value={this.state.post}
                        onChange={e => this.setState({ post: e.target.value })}
                    />
                    <button type="submit">Submit</button>
                    </form>

                    <Link to="/login">
                    <button>test login link</button>
                    </Link>
                    <Link to="/signup">
                    <button>test signup link</button>
                    </Link>
                    <Link to="/userprofile">
                    <button>test user profile link</button>
                    </Link>
                    <Link to="/farmerprofile">
                    <button>test farmer profile link</button>
                    </Link>
                    <Link to="/farmform">
                    <button>test add farm link</button>
                    </Link>
                <p>{this.state.responseToPost}</p> */}
                <div id="map-div">
                </div>
            </Fragment>
        )
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

export default Home
