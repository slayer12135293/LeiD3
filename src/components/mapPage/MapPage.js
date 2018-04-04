import React, { PureComponent } from 'react'
import MapContainer  from '../../lib/common/mapContainer'
import { connect } from 'react-redux'
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
