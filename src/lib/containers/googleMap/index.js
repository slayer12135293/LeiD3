import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { camelize } from './lib/String'
import { makeCancelable } from './lib/cancelablePromise'
import invariant from 'invariant'
import SearchAutoComplete from './components/searchAutoComplete/SearchAutoComplete'

const mapStyles = {
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    map: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
    },
}

const evtNames = [
    'ready',
    'click',
    'dragend',
    'recenter',
    'bounds_changed',
    'center_changed',
    'dblclick',
    'dragstart',
    'heading_change',
    'idle',
    'maptypeid_changed',
    'mousemove',
    'mouseout',
    'mouseover',
    'projection_changed',
    'resize',
    'rightclick',
    'tilesloaded',
    'tilt_changed',
    'zoom_changed',
    'place_changed', // Lei added
]

export { wrapper as GoogleApiWrapper } from './GoogleApiComponent'
export { Marker } from './components/Marker'
export { InfoWindow } from './components/InfoWindow'
export { HeatMap } from './components/HeatMap'
export { Polygon } from './components/Polygon'
export { Polyline } from './components/Polyline'

export class Map extends React.Component {
    constructor(props) {
        super(props)

        invariant(
            props.hasOwnProperty('google'),
            'You must include a `google` prop.'
        )

        this.listeners = {}
        this.state = {
            currentLocation: {
                lat: this.props.initialCenter.lat,
                lng: this.props.initialCenter.lng,
            },
            currentMap :{},
        }
        //lei pin
        //this.place_changed = this.place_changed.bind(this)
    }

    componentDidMount() {
        if (this.props.centerAroundCurrentLocation) {
            if (navigator && navigator.geolocation) {
                this.geoPromise = makeCancelable(
                    new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject)
                    })
                )

                this.geoPromise.promise
                    .then(pos => {
                        const coords = pos.coords
                        this.setState({
                            currentLocation: {
                                lat: coords.latitude,
                                lng: coords.longitude,
                            },
                        })
                    })
                    .catch(e => e)
            }
        }
        this.loadMap()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.google !== this.props.google) {
            this.loadMap()
        }
        if (this.props.visible !== prevProps.visible) {
            this.restyleMap()
        }
        if (this.props.zoom !== prevProps.zoom) {
            this.map.setZoom(this.props.zoom)
        }
        if (this.props.center !== prevProps.center) {
            this.setState({
                currentLocation: this.props.center,
            })
        }
        if (prevState.currentLocation !== this.state.currentLocation) {
            this.recenterMap()
        }
    }

    componentWillUnmount() {
        const { google } = this.props
        if (this.geoPromise) {
            this.geoPromise.cancel()
        }
        Object.keys(this.listeners).forEach(e => {
            google.maps.event.removeListener(this.listeners[e])
        })
    }

    loadMap() {
        if (this.props && this.props.google) {
            const { google } = this.props
            const maps = google.maps

            const mapRef = this.refs.map
            const node = ReactDOM.findDOMNode(mapRef)
            const curr = this.state.currentLocation
            const center = new maps.LatLng(curr.lat, curr.lng)

            const mapTypeIds = this.props.google.maps.MapTypeId || {}
            const mapTypeFromProps = String(this.props.mapType).toUpperCase()

            const mapConfig = Object.assign(
                {},
                {
                    mapTypeId: mapTypeIds[mapTypeFromProps],
                    center: center,
                    zoom: this.props.zoom,
                    maxZoom: this.props.maxZoom,
                    minZoom: this.props.minZoom,
                    clickableIcons: !!this.props.clickableIcons,
                    disableDefaultUI: this.props.disableDefaultUI,
                    zoomControl: this.props.zoomControl,
                    mapTypeControl: this.props.mapTypeControl,
                    scaleControl: this.props.scaleControl,
                    streetViewControl: this.props.streetViewControl,
                    panControl: this.props.panControl,
                    rotateControl: this.props.rotateControl,
                    fullscreenControl: this.props.fullscreenControl,
                    scrollwheel: this.props.scrollwheel,
                    draggable: this.props.draggable,
                    keyboardShortcuts: this.props.keyboardShortcuts,
                    disableDoubleClickZoom: this.props.disableDoubleClickZoom,
                    noClear: this.props.noClear,
                    styles: this.props.styles,
                    gestureHandling: this.props.gestureHandling,
                }
            )

            Object.keys(mapConfig).forEach(key => {
                // Allow to configure mapConfig with 'false'
                if (mapConfig[key] === null) {
                    delete mapConfig[key]
                }
            })

            this.map = new maps.Map(node, mapConfig)

            this.map.addListener('dragend', (evt) => {
                debugger
                console.log(evt)
            })

            // lei added 
            // Define the LatLng coordinates for the outer path.
            const outerCoords = [
                { lat: -32.364, lng: 153.207 }, // north west
                { lat: -35.364, lng: 153.207 }, // south west
                { lat: -35.364, lng: 158.207 }, // south east
                { lat: -32.364, lng: 158.207 },  // north east
            ]

            // Define the LatLng coordinates for an inner path.
            const innerCoords1 = [
                { lat: -33.364, lng: 154.207 },
                { lat: -34.364, lng: 154.207 },
                { lat: -34.364, lng: 155.207 },
                { lat: -33.364, lng: 155.207 },
            ]

            // Define the LatLng coordinates for another inner path.
            const innerCoords2 = [
                { lat: -33.364, lng: 156.207 },
                { lat: -34.364, lng: 156.207 },
                { lat: -34.364, lng: 157.207 },
                { lat: -33.364, lng: 157.207 },
            ]
            this.map.data.add({ geometry: new google.maps.Data.Polygon([ outerCoords,
                innerCoords1,
                innerCoords2 ]) })
            //

            //************************************drawing*********************
            const drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [ 'marker', 'circle', 'polygon', 'polyline', 'rectangle' ],
                },
                markerOptions: { icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png' },
                circleOptions: {
                    fillColor: '#ffff00',
                    fillOpacity: 1,
                    strokeWeight: 5,
                    clickable: false,
                    editable: true,
                    zIndex: 1,
                },
            })
            drawingManager.setMap(this.map)

            google.maps.event.addListener(drawingManager, 'circlecomplete', function(circle) {
                const radius = circle.getRadius()
                alert(radius + 'km2')
                circle.setMap(null)
            })
            google.maps.event.addListener(drawingManager, 'polylinecomplete', function(polyline) {                
                const polylinePath = polyline.getPath()
                alert(google.maps.geometry.spherical.computeLength(polyline.getPath()).toFixed(2) + 'km')
                polyline.setMap(null)                
            })
              
            google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
                if (event.type == 'circle') {
                    const radius = event.overlay.getRadius()
                }
            })
            //************************************************************************ */

            // search auto complete **************************************************

            // const card = document.getElementById('pac-card')
            // const input = document.getElementById('pac-input')
            // const types = document.getElementById('type-selector')
            // const strictBounds = document.getElementById('strict-bounds-selector')

            // this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card)
            // const autocomplete = new google.maps.places.Autocomplete(input)

            // // Bind the map's bounds (viewport) property to the autocomplete object,
            // // so that the autocomplete requests use the current map bounds for the
            // // bounds option in the request.
            // autocomplete.bindTo('bounds', this.map)

            // const infowindow = new google.maps.InfoWindow()
            // const infowindowContent = document.getElementById('infowindow-content')
            // infowindow.setContent(infowindowContent)
            // const marker = new google.maps.Marker({
            //     map: this.map,
            //     anchorPoint: new google.maps.Point(0, -29),
            // })

            const leifunc = ()=>{
                infowindow.close()
                marker.setVisible(false)
                const place = autocomplete.getPlace()
                if (!place.geometry) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    window.alert('No details available for input: \'' + place.name + '\'')
                    return
                }

                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    this.map.fitBounds(place.geometry.viewport)
                } else {
                    this.map.setCenter(place.geometry.location)
                    this.map.setZoom(17)  // Why 17? Because it looks good.
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
                infowindow.open(this.map, marker)                
            }                 
           
            //////////////////////////////////////////////////////////
            evtNames.forEach(e => {
                this.listeners[e] = this.map.addListener(e, this.handleEvent(e))
            })
            maps.event.trigger(this.map, 'ready')
            this.forceUpdate()

            this.setState({
                currentMap: this.map,
            })
        }
    }

    handleEvent(evtName) {
        let timeout
        const handlerName = `on${camelize(evtName)}`

        return e => {
            if (timeout) {
                clearTimeout(timeout)
                timeout = null
            }
            timeout = setTimeout(() => {
                if (this.props[handlerName]) {
                    this.props[handlerName](this.props, this.map, e)
                }
            }, 0)
        }
    }

    recenterMap() {
        const map = this.map

        const { google } = this.props

        if (!google) return
        const maps = google.maps

        if (map) {
            let center = this.state.currentLocation
            if (!(center instanceof google.maps.LatLng)) {
                center = new google.maps.LatLng(center.lat, center.lng)
            }
            // map.panTo(center)
            map.setCenter(center)
            maps.event.trigger(map, 'recenter')
        }
    }

    restyleMap() {
        if (this.map) {
            const { google } = this.props
            google.maps.event.trigger(this.map, 'resize')
        }
    }

    renderChildren() {
        const { children } = this.props

        if (!children) return

        return React.Children.map(children, c => {
            if (!c) return
            return React.cloneElement(c, {
                map: this.map,
                google: this.props.google,
                mapCenter: this.state.currentLocation,
            })
        })
    }

    render() {
        const { currentMap } = this.state
        const style = Object.assign({}, mapStyles.map, this.props.style, {
            display: this.props.visible ? 'inherit' : 'none',
        })

        const containerStyles = Object.assign(
            {},
            mapStyles.container,
            this.props.containerStyle
        )
        return (
            <div>
                <SearchAutoComplete 
                    map= {currentMap}                    
                />
                <div style={containerStyles} className={this.props.className}>                                
                    <div style={style} ref="map">
          Loading map...
                    </div>
                    {this.renderChildren()}
                </div>

            </div>
            
        )
    }
}

// auto complete listener
function setupClickListener(id, types,autocomplete) {
    const radioButton = document.getElementById(id)
    radioButton.addEventListener('click', function() {
        autocomplete.setTypes(types)
    })
}

Map.propTypes = {
    google: PropTypes.object,
    zoom: PropTypes.number,
    centerAroundCurrentLocation: PropTypes.bool,
    center: PropTypes.object,
    initialCenter: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
    containerStyle: PropTypes.object,
    visible: PropTypes.bool,
    mapType: PropTypes.string,
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
    clickableIcons: PropTypes.bool,
    disableDefaultUI: PropTypes.bool,
    zoomControl: PropTypes.bool,
    mapTypeControl: PropTypes.bool,
    scaleControl: PropTypes.bool,
    streetViewControl: PropTypes.bool,
    panControl: PropTypes.bool,
    rotateControl: PropTypes.bool,
    fullscreenControl: PropTypes.bool,
    scrollwheel: PropTypes.bool,
    draggable: PropTypes.bool,
    keyboardShortcuts: PropTypes.bool,
    disableDoubleClickZoom: PropTypes.bool,
    noClear: PropTypes.bool,
    styles: PropTypes.array,
    gestureHandling: PropTypes.string,
}

evtNames.forEach(e => (Map.propTypes[camelize(e)] = PropTypes.func))

Map.defaultProps = {
    zoom: 14,
    initialCenter: {
        lat: 37.774929,
        lng: -122.419416,
    },
    center: {},
    centerAroundCurrentLocation: false,
    style: {},
    containerStyle: {},
    visible: true,
}

export default Map
