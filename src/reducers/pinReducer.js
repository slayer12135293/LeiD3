import * as types from '../constants/actionTypes'

const initState = ''

export const pinReducer = (state = initState, action) =>{  

    switch (action.type) {
        case types.LOAD_PINS:    
            return{
                ...state,
                pins: action.markers,
            }     
        case types.RESET_TODEFAULT:  
            return initState        
        default:
            return state
    }
}
export default pinReducer
