import {TariffAction, TariffActionTypes, TariffState} from '../@types/tariffTypes'

const initialState: TariffState = {
    tariffs: [],
    fetching: false,
    error: ''
}

export default function TariffReducer(state: TariffState = initialState, action: TariffAction): TariffState {
    switch (action.type) {
        case TariffActionTypes.TARIFF_FETCH_LIST:
            return {...state, tariffs: action.payload, fetching: false}
        case TariffActionTypes.TARIFF_IS_FETCHING:
            return {...state, fetching: false}
        case TariffActionTypes.TARIFF_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}
