import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Map, InfoWindow, Marker, GoogleApiWrapper, Polygon } from './googleMap/index'
import './auto-complete.scss'
import SearchAutoComplete from './googleMap/components/searchAutoComplete/SearchAutoComplete'

class SmartMapContainer extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            defaultLat: 59.3353270,
            defaultLgt: 18.0728711,
        }    

    }
    componentDidMount () {  
    }

    render() {
        const { title, zoomlvl } = this.props
        const { defaultLat, defaultLgt } = this.state
        const triangleCoords = [
            { lat: 25.774, lng: -80.190 },
            { lat: 18.466, lng: -66.118 },
            { lat: 32.321, lng: -64.757 },
            { lat: 25.774, lng: -80.190 },
        ]
        return (
            <div>
                <h1>{title}</h1>   

                {/* <div className="pac-card" id="pac-card">
                    <div>
                        <div id="title">
                            Autocomplete search
                        </div>
                        <div id="type-selector" className="pac-controls">
                            <input type="radio" name="type" id="changetype-all" defaultChecked/>
                            <label htmlFor="changetype-all">All</label>
                            <input type="radio" name="type" id="changetype-establishment"/>
                            <label htmlFor="changetype-establishment">Establishments</label>
                            <input type="radio" name="type" id="changetype-address"/>
                            <label htmlFor="changetype-address">Addresses</label>
                            <input type="radio" name="type" id="changetype-geocode"/>
                            <label htmlFor="changetype-geocode">Geocodes</label>
                        </div>
                        <div id="strict-bounds-selector" className="pac-controls">
                            <input type="checkbox" id="use-strict-bounds" value="" defaultChecked />
                            <label htmlFor="use-strict-bounds">Strict Bounds</label>
                        </div>
                        
                    </div>
                    <div id="pac-container">
                        <input id="pac-input" type="text" placeholder="Enter a location" />
                    </div>
                </div>                 */}
    
                <Map 
                    google={google}
                    zoom={zoomlvl}
                    initialCenter={{
                        lat: defaultLat,
                        lng: defaultLgt,
                    }}
                >
                    <Polygon
                        paths={triangleCoords}
                        strokeColor="#0000FF"
                        strokeOpacity={0.8}
                        strokeWeight={2}
                        fillColor="#0000FF"
                        fillOpacity={0.35} />
                </Map>   
            </div>            
        )
    }
}

SmartMapContainer.propTypes = {
    title: PropTypes.string.isRequired,
    zoomlvl: PropTypes.number.isRequired,
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyC6SAcwZ895KK7ckh4fmZVPSS2OE4xe0nk'),
    libraries: [ 'drawing','places','geometry' ],
})(SmartMapContainer)
