import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Map, InfoWindow, Marker, GoogleApiWrapper, Polygon } from './googleMap/index'
import './auto-complete.scss'
import SearchAutoComplete from './googleMap/components/searchAutoComplete/SearchAutoComplete'

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

        const lei = [
            {
                id: 1,
                name: 'pub anchor',
                geoCode: {                
                    lat: 59.3412669, 
                    lng: 18.058471300000065,                
                },
            },
            {
                id: 2,
                name: 'konserthuset',
                geoCode: {                
                    lat: 59.3412669, 
                    lng: 18.058471300000065,                
                },
            },
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
                    {
                        lei !== undefined ? lei.map(marker => {
                            <Marker
                                // key={marker.id}
                                title={marker.name}
                                position={marker.geoCode}
                                // icon={{
                                //     url: 'http://icons.iconarchive.com/icons/jonathan-rey/simpsons/256/Homer-Simpson-04-Happy-icon.png',
                                //     anchor: new google.maps.Point(32,32),
                                //     scaledSize: new google.maps.Size(64,64),
                                // }} 
                            />
                        }) : <Marker />     
                           
                    }
                    
                    {/* <Marker
                        title={'The marker`s title will appear as a tooltip.'}
                        name={'SOMA'}
                        position={{ lat: 59.3412669, lng: 18.058471300000065 }} /> */}
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
