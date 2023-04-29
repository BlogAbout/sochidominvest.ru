import React, {useEffect} from 'react'
import {Route, Routes} from 'react-router-dom'
import {RouteNames} from '../../../helpers/routerHelper'
import {ToastContainer} from 'react-toastify'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {registerEventsEmitter, registerWebsocket} from '../../../helpers/eventsHelper'
import {useActions} from '../../../hooks/useActions'
import {IUser} from '../../../@types/IUser'
import MainPage from '../../pages/MainPage/MainPage'
import AboutPage from '../../pages/AboutPage/AboutPage'
import PolicyPage from '../../pages/PolicyPage/PolicyPage'
import FaqPage from '../../pages/FaqPage/FaqPage'
import ArticlesPage from '../../pages/ArticlesPage/ArticlesPage'
import ArticlePage from '../../pages/ArticlePage/ArticlePage'
import BuildingsPage from '../../pages/BuildingsPage/BuildingsPage'
import BuildingPage from '../../pages/BuildingPage/BuildingPage'
import CatalogPage from '../../pages/CatalogPage/CatalogPage'
import ReportPage from '../../pages/ReportsPage/ReportsPage'
import ToolPage from '../../pages/ToolPage/ToolPage'
import AdministrationPage from '../../pages/AdministrationPage/AdministrationPage'
import SupportPage from '../../pages/SupportPage/SupportPage'
import QuestionPage from '../../pages/QuestionsPage/QuestionsPage'
import DevelopersPage from '../../pages/DevelopersPage/DevelopersPage'
import DeveloperPage from '../../pages/DeveloperPage/DeveloperPage'
import AgentsPage from '../../pages/AgentsPage/AgentsPage'
import AgentPage from '../../pages/AgentPage/AgentPage'
import PostsPage from '../../pages/PostsPage/PostsPage'
import CompilationsPage from '../../pages/CompilationsPage/CompilationsPage'
import CompilationPage from '../../pages/CompilationPage/CompilationPage'
import BookingPage from '../../pages/BookingPage/BookingPage'
import ExternalUsersPage from '../../pages/ExternalUsersPage/ExternalUsersPage'
import MailingsPage from '../../pages/MailingsPage/MailingsPage'
import PaymentPage from '../../pages/PaymentPage/PaymentPage'
import DocumentsPage from '../../pages/DocumentsPage/DocumentsPage'
import UsersPage from '../../pages/UsersPage/UsersPage'
import UserPage from '../../pages/UserPage/UserPage'
import BusinessProcessPage from '../../pages/BusinessProcessPage/BusinessProcessPage'
import ArticlePanelPage from '../../pages/ArticlesPanelPage/ArticlesPanelPage'
import BuildingsPanelPage from '../../pages/BuildingsPanelPage/BuildingsPanelPage'
import FavoritePage from '../../pages/FavoritePage/FavoritePage'
import TariffPage from '../../pages/TariffPage/TariffPage'
import FilesPage from '../../pages/FilesPage/FilesPage'
import DesktopPage from '../../pages/DesktopPage/DesktopPage'
import StoreCategoriesPage from '../../pages/StoreCategoriesPage/StoreCategoriesPage'
import StoreCategoryPage from '../../pages/StoreCategoryPage/StoreCategoryPage'
import StoreProductsPage from '../../pages/StoreProductsPage/StoreProductsPage'
import StoreProductsPanelPage from '../../pages/StoreProductsPanelPage/StoreProductsPanelPage'
import StoreProductPage from '../../pages/StoreProductPage/StoreProductPage'
import classes from './AppRouter.module.scss'
import 'react-toastify/dist/ReactToastify.css'

const AppRouter: React.FC = () => {
    const {isAuth, user} = useTypedSelector(state => state.userReducer)

    const {setIsAuth, setUser, setUsersOnline, fetchSettings} = useActions()

    useEffect(() => {
        registerEventsEmitter()

        if (localStorage.getItem('auth')) {
            setIsAuth(true)

            const userJson = localStorage.getItem('user') || ''

            if (userJson) {
                const user: IUser = JSON.parse(userJson)
                setUser(user)
                registerWebsocket(user.id)
            }
        }

        window.events.on('messengerUpdateOnlineUsers', updateOnlineUsers)

        return () => {
            window.events.removeListener('messengerUpdateOnlineUsers', updateOnlineUsers)
        }
    }, [])

    useEffect(() => {
        if (isAuth) {
            fetchSettings()
        }
    }, [isAuth])

    // Обновление списка пользователей онлайн
    const updateOnlineUsers = (usersString: string): void => {
        if (usersString.trim() !== '') {
            const listUsersIds: number[] = JSON.parse(usersString)

            setUsersOnline(listUsersIds)
        }
    }

    return (
        <div className={classes.AppRouter}>
            <Routes>
                <Route path={RouteNames.MAIN} element={<MainPage/>}/>
                <Route path={RouteNames.ABOUT} element={<AboutPage/>}/>
                <Route path={RouteNames.POLICY} element={<PolicyPage/>}/>
                <Route path={RouteNames.FAQ} element={<FaqPage/>}/>
                <Route path={RouteNames.ARTICLE} element={<ArticlesPage/>}/>
                <Route path={RouteNames.ARTICLE_ITEM} element={<ArticlePage isPublic/>}/>
                <Route path={RouteNames.BUILDING} element={<BuildingsPage/>}/>
                <Route path={RouteNames.BUILDING_ITEM} element={<BuildingPage role={user.role_id} isPublic/>}/>
                <Route path={RouteNames.RENT} element={<BuildingsPage isRent/>}/>
                <Route path={RouteNames.RENT_ITEM} element={<BuildingPage role={user.role_id} isPublic isRent/>}/>
                <Route path={RouteNames.STORE_PRODUCTS} element={<StoreProductsPage/>}/>
                <Route path={RouteNames.STORE_PRODUCT} element={<StoreProductPage/>}/>

                {isAuth ?
                    <>
                        <Route path={RouteNames.P_DESKTOP} element={<DesktopPage/>}/>
                        <Route path={RouteNames.P_CATALOG} element={<CatalogPage name='Каталоги' type='catalog'/>}/>
                        <Route path={RouteNames.P_CRM} element={<CatalogPage name='CRM' type='crm'/>}/>
                        <Route path={RouteNames.P_REPORT} element={<ReportPage/>}/>
                        <Route path={RouteNames.P_TOOL} element={<ToolPage/>}/>
                        <Route path={RouteNames.P_ADMINISTRATION} element={<AdministrationPage/>}/>
                        <Route path={RouteNames.P_SUPPORT} element={<SupportPage/>}/>
                        <Route path={RouteNames.P_QUESTION} element={<QuestionPage/>}/>
                        <Route path={RouteNames.P_DEVELOPER} element={<DevelopersPage/>}/>
                        <Route path={RouteNames.P_DEVELOPER_ITEM} element={<DeveloperPage/>}/>
                        <Route path={RouteNames.P_AGENT} element={<AgentsPage/>}/>
                        <Route path={RouteNames.P_AGENT_ITEM} element={<AgentPage/>}/>
                        <Route path={RouteNames.P_POST} element={<PostsPage/>}/>
                        <Route path={RouteNames.P_COMPILATION} element={<CompilationsPage/>}/>
                        <Route path={RouteNames.P_COMPILATION_ITEM} element={<CompilationPage/>}/>
                        <Route path={RouteNames.P_BOOKING} element={<BookingPage/>}/>
                        <Route path={RouteNames.P_USER_EXTERNAL} element={<ExternalUsersPage/>}/>
                        <Route path={RouteNames.P_MAILING} element={<MailingsPage/>}/>
                        <Route path={RouteNames.P_PAYMENT} element={<PaymentPage/>}/>
                        <Route path={RouteNames.P_DOCUMENT} element={<DocumentsPage/>}/>
                        <Route path={RouteNames.P_USER} element={<UsersPage/>}/>
                        <Route path={RouteNames.P_USER_ITEM} element={<UserPage/>}/>
                        <Route path={RouteNames.P_BP} element={<BusinessProcessPage/>}/>
                        <Route path={RouteNames.P_ARTICLE} element={<ArticlePanelPage/>}/>
                        <Route path={RouteNames.P_BUILDING} element={<BuildingsPanelPage/>}/>
                        <Route path={RouteNames.P_FAVORITE} element={<FavoritePage/>}/>
                        <Route path={RouteNames.P_TARIFF} element={<TariffPage/>}/>
                        <Route path={RouteNames.P_FILE_MANAGER} element={<FilesPage/>}/>
                        <Route path={RouteNames.P_STORE_CATEGORIES} element={<StoreCategoriesPage/>}/>
                        <Route path={RouteNames.P_STORE_CATEGORY} element={<StoreCategoryPage/>}/>
                        <Route path={RouteNames.P_STORE_PRODUCTS} element={<StoreProductsPanelPage/>}/>
                    </>
                    : null
                }
            </Routes>

            <ToastContainer position={'bottom-right'}
                            autoClose={5000}
                            draggablePercent={60}
                            pauseOnHover={true}
                            closeOnClick={true}
                            hideProgressBar={true}
                            draggable={true}
            />
        </div>
    )
}

export default AppRouter
