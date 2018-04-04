import React, { PureComponent } from 'react'
import { Map, InfoWindow, Marker, GoogleApiWrapper, Polygon } from '../containers/googleMap/index'
import PropTypes from 'prop-types'

class MapContainer extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            defaultLat: 59.3353270,
            defaultLgt: 18.0728711,
            currentlat:0,
            currentlgt:0,
        }    

    }
    componentDidMount () { 
        const { google } = this.props        
    }

    _handleClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=>{
                console.log(position)
                this.setState({
                    currentlat: position.coords.latitude,
                    currentlgt: position.coords.longitude,
                })
            })
        }
    }
    render() {
        
        const { title, zoomlvl, google } = this.props
        const { defaultLat, defaultLgt, currentlat, currentlgt } = this.state

        return (
            
            <div>
                <h1>{title}</h1>
                <h2>lat:{currentlat} lgt: {currentlgt}</h2>
                
                <a className="btn btn-primary" style={{ marginBottom:'10px' }} onClick={this._handleClick}>get current location </a>
                
                <div >
                    <Map 
                        google={google}
                        zoom={zoomlvl}
                        initialCenter={{
                            lat: defaultLat,
                            lng: defaultLgt,
                        }}
                        center={{
                            lat: currentlat,
                            lng: currentlgt,
                        }}
                        showSearch={false}
                        activeDrawing={false}
                    >
                        <Marker />
                    </Map>
                </div>                
            </div>            
        )
    }
}

MapContainer.propTypes = {
    title: PropTypes.string.isRequired,
    zoomlvl: PropTypes.number.isRequired,
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyC6SAcwZ895KK7ckh4fmZVPSS2OE4xe0nk'),
    libraries: [ 'drawing','places','geometry' ],
})(MapContainer)
