import {TariffAction, TariffActionTypes} from '../@types/tariffTypes'
import {ITariff} from '../../@types/ITariff'
import {AppDispatch} from '../reducers'
import TariffService from '../../api/TariffService'

export const TariffActionCreators = {
    setTariffs: (tariffs: ITariff[]): TariffAction => ({
        type: TariffActionTypes.TARIFF_FETCH_LIST,
        payload: tariffs
    }),
    setFetching: (payload: boolean): TariffAction => ({
        type: TariffActionTypes.TARIFF_IS_FETCHING,
        payload
    }),
    setError: (payload: string): TariffAction => ({
        type: TariffActionTypes.TARIFF_ERROR,
        payload
    }),
    fetchTariffList: () => async (dispatch: AppDispatch) => {
        dispatch(TariffActionCreators.setFetching(true))

        try {
            const response = await TariffService.fetchTariffs()

            if (response.status === 200) {
                dispatch(TariffActionCreators.setTariffs(response.data.data))
            } else {
                dispatch(TariffActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(TariffActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    }
}
