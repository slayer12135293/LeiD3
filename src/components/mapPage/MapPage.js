import React, { PureComponent } from 'react'
import MapContainer  from '../../lib/common/mapContainer'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react'
import './styles/map-page.scss'

class MapPage extends PureComponent {
    render(){
        return(            
            <div className="map-page">
                <MapContainer 
                    title={'this is a title sent from props'} 
                    zoomlvl={14}
                />
            </div>
        )
    }    
}
export default MapPage
