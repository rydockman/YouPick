import React, { Component } from 'react'
//import { Link } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import ReactDOM from 'react-dom';
import './Map.css'

export class SimpleMap extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
      render() {
        return (
          <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
              //bootstrapURLKeys={{ key: 'YOUR GOOGLE MAPS KEY'}}
              defaultCenter={this.props.center}
              defaultZoom={this.props.zoom}
            >
              <LocationPin
                lat={this.props.center.lat}
                lng={this.props.center.lng}
                text={this.props.name}
              />
              {this.props.otherPoints.map((point, i) => <LocationPin key={i} lat={point.lat} lng={point.lng} text={point.text} /> )}
            </GoogleMapReact>
          </div>
        );
      }
}

const LocationPin = ({ text, $hover }) => {
  return (
    <div className="pin">
      <div className="pin-text">
        {text}
      </div>
    </div>
    );
}

export default SimpleMap
