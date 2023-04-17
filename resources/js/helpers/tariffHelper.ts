import {ITariff} from '../@types/ITariff'

export const tariffs: ITariff[] = [
    {
        id: 1,
        name: 'Базовый',
        cost: 2100,
        privileges: [
            '5 активных объектов недвижимости (кроме типа "Новостройка")',
            '300 уникальных просмотров в публичном разделе сервиса'
        ]
    },
    {
        id: 2,
        name: 'Бизнес',
        cost: 9500,
        privileges: [
            '10 активных объектов недвижимости (любого типа)',
            '10 активных квартир в шахматке на каждый объект недвижимости типа "Новостройка"',
            '500 уникальных просмотров в публичном разделе сервиса',
            'Доступ к созданию 1 своего Агентства',
            'Доступ к созданию 1 своего Застройщика'
        ]
    },
    {
        id: 3,
        name: 'Эффективность Плюс',
        cost: 25000,
        privileges: [
            '25 активных объектов недвижимости (любого типа)',
            'Нелимитированное количество активных квартир в шахматке на каждый объект недвижимости типа "Новостройка"',
            'Нелимитированное количество уникальных просмотров в публичном разделе сервиса',
            'Доступ к созданию нелимитированного количества своих Агентств',
            'Доступ к созданию нелимитированного количества своих Застройщиков',
            'Доступ к конструктору документов',
            'Помощь наших менеджеров в подборе и организации сделок купли/продажи и сдачи/аренды'
        ]
    }
]

export const getTariffText = (key: number) => {
    const find = tariffs.find((item: ITariff) => item.id === key)
    return find ? find.name : ''
}

export const compareTariffLevels = (oldTariff: number, newTariff: number): number => {
    const findOldTariffIndex = tariffs.findIndex((item: ITariff) => item.id === oldTariff)
    const findNewTariffIndex = tariffs.findIndex((item: ITariff) => item.id === newTariff)

    if (findOldTariffIndex === findNewTariffIndex) {
        return 0
    } else if (findOldTariffIndex === -1 || findNewTariffIndex > findOldTariffIndex) {
        return 1
    } else if (findNewTariffIndex === -1 || findNewTariffIndex < findOldTariffIndex) {
        return -1
    }

    return 0
}
