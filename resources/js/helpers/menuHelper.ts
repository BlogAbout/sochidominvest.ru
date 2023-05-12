import {RouteNames} from './routerHelper'
import {IMenuLink, ISubMenu} from '../@types/IMenu'
import {checkRules, Rules} from "./accessHelper";

export const menuMain: IMenuLink[] = [
    {
        route: RouteNames.MAIN,
        title: 'Главная'
    },
    {
        route: RouteNames.ABOUT,
        title: 'О компании'
    },
    {
        route: RouteNames.BUILDING,
        title: 'Недвижимость'
    },
    {
        route: RouteNames.RENT,
        title: 'Аренда'
    },
    {
        route: RouteNames.STORE_PRODUCTS,
        title: 'Товары'
    },
    {
        route: RouteNames.ARTICLE,
        title: 'Статьи'
    }
]

export const menuFooter: IMenuLink[] = [
    {
        route: RouteNames.MAIN,
        title: 'Главная'
    },
    {
        route: RouteNames.ABOUT,
        title: 'О компании'
    },
    {
        route: RouteNames.FAQ,
        title: 'Вопрос/Ответ'
    },
    {
        route: RouteNames.POLICY,
        title: 'Политика'
    },
    {
        route: RouteNames.ARTICLE,
        title: 'Статьи'
    },
]

export const menuPanel: IMenuLink[] = [
    {
        route: RouteNames.P_DESKTOP,
        title: 'Рабочий стол',
        icon: 'house'
    },
    {
        route: RouteNames.SEPARATOR,
        title: '',
        isSeparator: true
    },
    {
        route: RouteNames.P_USER,
        title: 'Пользователи',
        icon: 'user',
        unavailable: !checkRules([Rules.IS_ADMINISTRATOR])
    },
    {
        route: RouteNames.P_BUILDING,
        title: 'Недвижимость',
        icon: 'building'
    },
    {
        route: RouteNames.P_ARTICLE,
        title: 'Статьи',
        icon: 'newspaper'
    },
    {
        route: RouteNames.P_STORE_PRODUCTS,
        title: 'Магазин',
        icon: 'store'
    },
    {
        route: RouteNames.SEPARATOR,
        title: '',
        isSeparator: true
    },
    {
        route: RouteNames.P_FILE_MANAGER,
        title: 'Файловый менеджер',
        icon: 'photo-film'
    },
    {
        route: RouteNames.P_CATALOG,
        title: 'Каталоги',
        icon: 'folder-tree',
        unavailable: !checkRules([Rules.MORE_TARIFF_FREE])
    },
    {
        route: RouteNames.P_CRM,
        title: 'CRM',
        icon: 'chart-pie',
        unavailable: !checkRules([Rules.MORE_TARIFF_FREE])
    },
    {
        route: RouteNames.P_DOCUMENT,
        title: 'Документы',
        icon: 'book',
        unavailable: !checkRules([Rules.MORE_TARIFF_BASE])
    },
    {
        route: RouteNames.P_REPORT,
        title: 'Отчеты',
        icon: 'file-excel',
        unavailable: !checkRules([Rules.IS_MANAGER])
    },
    {
        route: RouteNames.SEPARATOR,
        title: '',
        isSeparator: true
    },
    {
        route: RouteNames.P_TOOL,
        title: 'Инструменты',
        icon: 'screwdriver-wrench',
        unavailable: !checkRules([Rules.IS_ADMINISTRATOR])
    },
    {
        route: RouteNames.P_ADMINISTRATION,
        title: 'Администрирование',
        icon: 'gear',
        unavailable: !checkRules([Rules.IS_ADMINISTRATOR])
    },
    {
        route: RouteNames.P_SUPPORT,
        title: 'Поддержка',
        icon: 'question'
    },
]

export const subMenuCatalog: ISubMenu[] = [
    {
        href: RouteNames.P_DEVELOPER,
        title: 'Застройщики',
        disabled: false,
        icon: '',
        type: 'catalog',
        description: 'Предоставляет функционал управления застройщиками',
        unavailable: !checkRules([Rules.MORE_TARIFF_FREE])
    },
    {
        href: RouteNames.P_AGENT,
        title: 'Агентства',
        disabled: false,
        icon: '',
        type: 'catalog',
        description: 'Предоставляет функционал управления агентствами',
        unavailable: !checkRules([Rules.MORE_TARIFF_FREE])
    },
    {
        href: RouteNames.P_POST,
        title: 'Должности',
        disabled: false,
        icon: '',
        type: 'catalog',
        description: 'Организация должностей для структуризации сотрудников',
        unavailable: !checkRules([Rules.IS_ADMINISTRATOR])
    },
    {
        href: RouteNames.P_COMPILATION,
        title: 'Подборки',
        disabled: false,
        icon: '',
        type: 'catalog',
        description: 'Подборки объектов недвижимости, статей и других наборов для последующей рассылки',
        unavailable: !checkRules([Rules.IS_MANAGER])
    },
    {
        href: RouteNames.P_WIDGET,
        title: 'Виджеты',
        disabled: true,
        icon: '',
        type: 'catalog',
        description: 'Создание дополнительных виджетов для главной страницы сайта',
        unavailable: !checkRules([Rules.IS_MANAGER])
    },
    {
        href: RouteNames.P_BANNER,
        title: 'Баннеры',
        disabled: true,
        icon: '',
        type: 'catalog',
        description: 'Функционал управления и публикации собственных рекламных баннеров для привлечения клиентов и заработка',
        unavailable: !checkRules([Rules.MORE_TARIFF_BUSINESS])
    },
    {
        href: RouteNames.P_QUESTION,
        title: 'F.A.Q.',
        disabled: false,
        icon: '',
        type: 'catalog',
        description: 'Управление списками вопросов и ответов для помощи пользователям',
        unavailable: !checkRules([Rules.IS_MANAGER])
    },
    {
        href: RouteNames.P_STORE_CATEGORIES,
        title: 'Категории товаров',
        disabled: false,
        icon: '',
        type: 'catalog',
        description: 'Настройка категорий товаров для магазина с возможностью задания необходимых полей',
        unavailable: !checkRules([Rules.IS_MANAGER])
    },
    {
        href: RouteNames.P_BP,
        title: 'Бизнес-процессы',
        disabled: false,
        icon: '',
        type: 'crm',
        description: 'Организация бизнес-процессов для поддержания деятельности компании и проведения сделок',
        unavailable: !checkRules([Rules.MORE_TARIFF_FREE])
    },
    {
        href: RouteNames.P_BOOKING,
        title: 'Бронирование',
        disabled: false,
        icon: '',
        type: 'crm',
        description: 'Функционал организации бронирования и аренды объектов недвижимости',
        unavailable: !checkRules([Rules.IS_MANAGER])
    },
    {
        href: RouteNames.P_PAYMENT,
        title: 'Платежи и транзакции',
        disabled: false,
        icon: '',
        type: 'crm',
        description: 'Управление платежами и транзакциями, производимыми пользователями',
        unavailable: !checkRules([Rules.MORE_TARIFF_FREE])
    },
    {
        href: RouteNames.P_USER_EXTERNAL,
        title: 'Внешние пользователи',
        disabled: false,
        icon: '',
        type: 'crm',
        description: 'Каталог управления внешними (не зарегистрированными) пользователями',
        unavailable: !checkRules([Rules.IS_MANAGER])
    },
    {
        href: RouteNames.P_MAILING,
        title: 'Рассылки',
        disabled: false,
        icon: '',
        type: 'crm',
        description: 'Функционал управления рассылками почтовых и браузерных уведомлений для пользователей',
        unavailable: !checkRules([Rules.IS_ADMINISTRATOR])
    },
    {
        href: RouteNames.P_PARTNER,
        title: 'Спонсоры и партнеры',
        disabled: true,
        icon: '',
        type: 'crm',
        description: 'Средства работы с партнерами и спонсорами, заработок на партнерстве',
        unavailable: !checkRules([Rules.MORE_TARIFF_BUSINESS])
    }
]
