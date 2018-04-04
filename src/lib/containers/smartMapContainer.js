import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Map, InfoWindow, Marker, GoogleApiWrapper, Polygon } from './googleMap/index'
import './auto-complete.scss'
import SearchAutoComplete from './googleMap/components/searchAutoComplete/SearchAutoComplete'
import SmartMarkers from './googleMap/components/smartMarker/smartMarkers'

class SmartMapContainerRaw extends PureComponent {
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
        const { title, zoomlvl,markers } = this.props
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
                
                <Map 
                    google={google}
                    zoom={zoomlvl}
                    initialCenter={{
                        lat: defaultLat,
                        lng: defaultLgt,
                    }}
                >
                    <SmartMarkers markers= {markers}/>           
                    <SearchAutoComplete google={google}/>
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

SmartMapContainerRaw.propTypes = {
    title: PropTypes.string.isRequired,
    zoomlvl: PropTypes.number.isRequired,
}

const mapStatetoProps = (state)=>{
    return {
        markers: state.pinMarkers.pins,
    }
}

export const SmartMapContainer =  connect(mapStatetoProps)(GoogleApiWrapper({
    apiKey: ('AIzaSyC6SAcwZ895KK7ckh4fmZVPSS2OE4xe0nk'),
    libraries: [ 'drawing','places','geometry' ],
})(SmartMapContainerRaw))
