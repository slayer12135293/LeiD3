import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './styles/search-auto-complete.scss'

class SearchAutoComplete extends PureComponent{
    constructor(props) {
        super(props)
        this.state = {
            changeType :'',
            useStrictBounds: false,
        }
        this._typeChange = this._typeChange.bind(this)
        this._strictBoundsChange = this._strictBoundsChange.bind(this)
        
    }
    componentDidMount(){      
    }
    componentDidUpdate(prevProps, prevState){       
        if(this.props.map !== prevProps.map){
            this.props.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this.refs.pacCard)     
            this._autoCompleteLoader()     
        }
               
        if (this.state.changeType !== prevState.changeType ||
            this.state.useStrictBounds !== prevState.useStrictBounds) {     
            if(this.state.changeType === ''){
                this.autocomplete.setTypes([])
            }else{
                this.autocomplete.setTypes( [ this.state.changeType ] )
            } 
            this.autocomplete.setOptions({ strictBounds: this.state.useStrictBounds })  
        }         
    }
    _autoCompleteLoader(){
        const { map } = this.props

        this.autocomplete = new google.maps.places.Autocomplete(this.refs.pacInput)            
        const infowindow = new google.maps.InfoWindow()
        this.autocomplete.bindTo('bounds',map)
        const infowindowContent = document.getElementById('infowindow-content')
        infowindow.setContent(infowindowContent)
        const marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29),
        })
        
        this.autocomplete.addListener('place_changed', ()=> {
            infowindow.close()
            marker.setVisible(false)
            const place = this.autocomplete.getPlace()
            if (!place.geometry) {
                window.alert('No details available for input: \'' + place.name + '\'')
                return
            }  
            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport)
            } else {
                map.setCenter(place.geometry.location)
                map.setZoom(17)  // Why 17? Because it looks good.
            }
            marker.setPosition(place.geometry.location)
            marker.setVisible(true)
  
            let address = ''
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || ''),
                ].join(' ')
            }
  
            infowindowContent.children['place-icon'].src = place.icon
            infowindowContent.children['place-name'].textContent = place.name
            infowindowContent.children['place-address'].textContent = address
            infowindow.open(map, marker)
        })

    }
        
    _typeChange(event){
        this.setState({
            changeType:event.target.value,
        })
    }
    _strictBoundsChange(event){
        this.setState({
            useStrictBounds:event.target.checked,
        })
    }   

    render(){
        return(            
            <div className="pac-card" id="pac-card" ref="pacCard">
                <div>
                    <div id="title">
                            Autocomplete search
                    </div>
                    <div id="type-selector" className="pac-controls" onChange={this._typeChange}>
                        <input type="radio" name="type" id="changetype-all" value="" defaultChecked />
                        <label htmlFor="changetype-all">All</label>
                        <input type="radio" name="type" id="changetype-establishment" value="establishment" />
                        <label htmlFor="changetype-establishment">Establishments</label>
                        <input type="radio" name="type" id="changetype-address" value="address"/>
                        <label htmlFor="changetype-address">Addresses</label>
                        <input type="radio" name="type" id="changetype-geocode" value="geocode"/>
                        <label htmlFor="changetype-geocode">Geocodes</label>
                    </div>
                    <div id="strict-bounds-selector" className="pac-controls">
                        <input type="checkbox" id="use-strict-bounds" onChange={this._strictBoundsChange}/>
                        <label htmlFor="use-strict-bounds">Strict Bounds</label>
                    </div>
                        
                </div>
                <div id="pac-container">
                    <input id="pac-input" ref="pacInput" type="text" placeholder="Enter a location"  />
                </div>
                <div id="infowindow-content">
                    <img src="" width="16" height="16" id="place-icon"/>
                    <span id="place-name"  className="title" /><br/>
                    <span id="place-address" />
                </div>
            </div>              
        )
    }
}

export default SearchAutoComplete
