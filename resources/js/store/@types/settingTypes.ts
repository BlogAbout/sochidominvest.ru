import {ISetting} from '../../@types/ISetting'

export interface SettingState {
    settings: ISetting
    fetching: boolean
    error: string
}

export enum SettingActionTypes {
    SETTING_FETCH_LIST = 'SETTING_FETCH_LIST',
    ADMINISTRATION_IS_FETCHING = 'ADMINISTRATION_IS_FETCHING',
    ADMINISTRATION_ERROR = 'ADMINISTRATION_ERROR'
}

interface SettingFetchListAction {
    type: SettingActionTypes.SETTING_FETCH_LIST
    payload: ISetting
}

export interface SettingIsFetchingAction {
    type: SettingActionTypes.ADMINISTRATION_IS_FETCHING
    payload: boolean
}

export interface SettingErrorAction {
    type: SettingActionTypes.ADMINISTRATION_ERROR
    payload: string
}

export type SettingAction = SettingFetchListAction | SettingIsFetchingAction | SettingErrorAction
