import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class SmartMarkers extends PureComponent{

    componentDidUpdate(prevProps) {
        if (this.props.markers !== '' && this.props.markers !== undefined){             
            this._renderMarker()
        }
    }
    _renderMarker() {
        const { map, markers } = this.props
        markers.map( item =>{
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(item.geoCode.lat, item.geoCode.lng),
                title: item.title,
            })
            marker.setMap(map)
            const infowindow = new google.maps.InfoWindow({
                content: '<h2>' + item.name + '</h2>' + 'this is rich html' ,
            })

            marker.addListener('click', ()=>{
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null)
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE)
                }
                infowindow.open(map, marker)
            })
        })        
    }
        
    render() {
        return null
    }
}
export default SmartMarkers
