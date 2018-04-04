import { combineReducers } from 'redux'
import pinMarkers from './pinReducer'

const rootReducer = combineReducers({
    pinMarkers,
})

export default rootReducer
