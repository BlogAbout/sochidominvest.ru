import {SettingAction, SettingActionTypes} from '../@types/settingTypes'
import {ISetting} from '../../@types/ISetting'
import {AppDispatch} from '../reducers'
import SettingService from '../../api/SettingService'

export const SettingActionCreators = {
    setSettings: (settings: ISetting): SettingAction => ({
        type: SettingActionTypes.SETTING_FETCH_LIST,
        payload: settings
    }),
    setFetching: (payload: boolean): SettingAction => ({
        type: SettingActionTypes.ADMINISTRATION_IS_FETCHING,
        payload
    }),
    setError: (payload: string): SettingAction => ({
        type: SettingActionTypes.ADMINISTRATION_ERROR,
        payload
    }),
    fetchSettings: () => async (dispatch: AppDispatch) => {
        dispatch(SettingActionCreators.setFetching(true))

        try {
            const response = await SettingService.fetchSettings()

            if (response.status === 200) {
                dispatch(SettingActionCreators.setSettings(response.data))
            } else {
                dispatch(SettingActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(SettingActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    },
    saveSetting: (settings: ISetting) => async (dispatch: AppDispatch) => {
        dispatch(SettingActionCreators.setFetching(true))

        try {
            const response = await SettingService.saveSetting(settings)

            if (response.status === 200) {
                dispatch(SettingActionCreators.setSettings(response.data))
            } else {
                dispatch(SettingActionCreators.setError('Ошибка обновления данных'))
            }
        } catch (e) {
            dispatch(SettingActionCreators.setError('Непредвиденная ошибка обновления данных'))
            console.error('Непредвиденная ошибка обновления данных', e)
        }
    }
}
