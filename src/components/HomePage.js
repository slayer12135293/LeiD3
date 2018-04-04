import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadPins, resetPins } from '../actions/pinActions'

class HomePage extends PureComponent {
    _loadMarkers = () => {
        const { loadPins } = this.props
        const markers = [
            {
                id: 1,
                name: 'pub anchor',
                geoCode: {                
                    lat: 59.3412669, 
                    lng: 18.1,                
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
        loadPins(markers)    
    }
    _resetMarkers = ()=>{
        const { resetPins } = this.props
        resetPins()
    }
    render(){
        const { resetPins } = this.props
        return (
            <div>
                <h1>React GoogleMap Demo</h1>
                <div> body </div>  
                <a className="btn btn-primary" onClick={this._loadMarkers}> load pins</a>
                <br/><br/><br/><br/>
                <a className="btn btn-primary" onClick={this._resetMarkers}> reset pins</a>
                      
            </div>
        )
    }    
}

const matchDispatchToProps = (dispatch)=>{
    return bindActionCreators({
        loadPins:loadPins,
        resetPins:resetPins,
    },dispatch)
}

export default connect(null,matchDispatchToProps)(HomePage)
