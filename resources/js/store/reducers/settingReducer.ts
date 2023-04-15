import {SettingAction, SettingActionTypes, SettingState} from '../@types/settingTypes'
import {ISetting} from '../../@types/ISetting'

const initialState: SettingState = {
    settings: {} as ISetting,
    fetching: false,
    error: ''
}

export default function SettingReducer(state: SettingState = initialState, action: SettingAction): SettingState {
    switch (action.type) {
        case SettingActionTypes.SETTING_FETCH_LIST:
            return {...state, settings: action.payload, fetching: false}
        case SettingActionTypes.ADMINISTRATION_IS_FETCHING:
            return {...state, fetching: false}
        case SettingActionTypes.ADMINISTRATION_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}
