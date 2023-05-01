import {ITariff} from '../../@types/ITariff'

export interface TariffState {
    tariffs: ITariff[]
    fetching: boolean
    error: string
}

export enum TariffActionTypes {
    TARIFF_FETCH_LIST = 'TARIFF_FETCH_LIST',
    TARIFF_IS_FETCHING = 'TARIFF_IS_FETCHING',
    TARIFF_ERROR = 'TARIFF_ERROR'
}

interface TariffFetchListAction {
    type: TariffActionTypes.TARIFF_FETCH_LIST
    payload: ITariff[]
}

export interface TariffIsFetchingAction {
    type: TariffActionTypes.TARIFF_IS_FETCHING
    payload: boolean
}

export interface TariffErrorAction {
    type: TariffActionTypes.TARIFF_ERROR
    payload: string
}

export type TariffAction = TariffFetchListAction | TariffIsFetchingAction | TariffErrorAction
