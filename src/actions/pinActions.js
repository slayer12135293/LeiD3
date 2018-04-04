import * as types from '../constants/actionTypes'

export const loadPins = (markers) =>{
    return{
        type: types.LOAD_PINS,
        markers,
    }
}

export const resetPins = () => {
    return{
        type: types.RESET_TODEFAULT,
    }
}
