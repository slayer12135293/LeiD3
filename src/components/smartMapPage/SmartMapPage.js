import React, { PureComponent } from 'react'
import SmartMapContainer  from '../../lib/containers/smartMapContainer'
import MapContainer  from '../../lib/common/mapContainer'
import './styles/smart-map-page.scss'

class SmartMapPage extends PureComponent {
    render(){
        return(            
            <div className="map-page">     
                <SmartMapContainer 
                    title={'this is a smart map'} 
                    zoomlvl={14}
                />
            </div>
        )
    }    
}
export default SmartMapPage
