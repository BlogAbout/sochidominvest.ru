import * as Showdown from 'showdown'

export const configuration = {
    apiPath: 'http://sochidominvest/api',
    // apiPath: 'https://api.sochidominvest.ru/api/v1',
    webSocketPath: 'ws://127.0.0.1:8081',
    // webSocketPath: 'wss://api.sochidominvest.ru:8081',
    apiUrl: 'https://api.sochidominvest.ru/',
    siteUrl: 'https://sochidominvest.ru/',
    siteTitle: 'СОЧИДОМИНВЕСТ',
    sitePhone: '+7 (985) 767-04-21',
    // sitePhone: '+7 (918) 605-34-27',
    sitePhoneUrl: 'tel:+79857670421',
    // sitePhoneUrl: 'tel:+79186053427',
    siteEmail: 'info@sochidominvest.ru',
    siteEmailUrl: 'mailto:info@sochidominvest.ru',
    apiYandexMapKey: '3ed788dc-edd5-4bce-8720-6cd8464b45bd',
    apiYandexMapIcon: 'islands#blueIcon'
}

export const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
})
