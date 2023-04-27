import React, {useEffect, useRef, useState} from 'react'
import {Link, NavLink, useNavigate} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classNames from 'classnames/bind'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {RouteNames} from '../../../helpers/routerHelper'
import {IMenuLink} from '../../../@types/IMenu'
import {IUser} from '../../../@types/IUser'
import {getUserFromStorage} from '../../../helpers/userHelper'
import {allowForRole, allowForTariff} from '../../../helpers/accessHelper'
import {menuPanel} from '../../../helpers/menuHelper'
import MenuToggle from '../MenuToggle/MenuToggle'
import Avatar from '../Avatar/Avatar'
import openPopupUserCreate from '../../popup/PopupUserCreate/PopupUserCreate'
import openPopupSearchPanel from '../../popup/PopupSearchPanel/PopupSearchPanel'
import classes from './Navigation.module.scss'

const cx = classNames.bind(classes)

const Navigation: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const refProfile = useRef<HTMLDivElement>(null)
    const refUserPanel = useRef<HTMLDivElement>(null)

    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [showUserPanel, setShowUserPanel] = useState(false)
    const [userData, setUserData] = useState<IUser>({
        id: null,
        name: '',
        email: '',
        password: '',
        phone: '',
        role_id: 1,
        is_active: 1,
        tariff_id: null
    })

    const {user} = useTypedSelector(state => state.userReducer)
    const {logout} = useActions()

    useEffect(() => {
        const userUpdate: IUser | null = getUserFromStorage()

        if (userUpdate) {
            setUserData(userUpdate)
        }

        document.addEventListener('click', handleClickOutsideUserPanel)

        return () => {
            document.removeEventListener('click', handleClickOutsideUserPanel)
        }
    }, [])

    const handleClickOutsideUserPanel = (event: Event): void => {
        if (!!refUserPanel.current
            && !!refProfile.current
            && !!event.target
            && !refUserPanel.current.contains(event.target as Node)
            && !refProfile.current.contains(event.target as Node)
        ) {
            setShowUserPanel(false)
        }
    }

    const onToggleMobileMenuHandler = () => {
        setShowMobileMenu(!showMobileMenu)
    }

    const onHideMobileMenuHandler = () => {
        setShowMobileMenu(false)
    }

    const onClickUserProfile = () => {
        if (userData && userData.id) {
            openPopupUserCreate(document.body, {
                user: null,
                userId: userData.id,
                onSave: () => {
                    const userUpdate: IUser | null = getUserFromStorage()
                    if (userUpdate) {
                        setUserData(userUpdate)
                    }
                }
            })
        }
    }

    return (
        <>
            <MenuToggle show={showMobileMenu}
                        onToggle={onToggleMobileMenuHandler.bind(this)}
                        inPanel
            />

            <nav className={cx({'Navigation': true, 'show': showMobileMenu})}>
                <div className={cx({'userPanel': true, 'show': showUserPanel})} ref={refUserPanel}>
                    <div className={classes.userName}>
                        <span className={classes.name}>{userData.name}</span>
                        {userData.post ? <span className={classes.post}>{userData.post.name}</span> : null}
                    </div>

                    <div className={classes.icon}
                         title='Редактировать профиль'
                         onClick={onClickUserProfile.bind(this)}
                    >
                        <FontAwesomeIcon icon='pen-to-square'/>
                        <span>Профиль</span>
                    </div>

                    <div className={classes.icon}
                         title='Глобальный поиск'
                         onClick={() => {
                             // openPopupSearchPanel(document.body, {
                             //     role: role,
                             //     navigate: navigate
                             // })
                         }}
                    >
                        <FontAwesomeIcon icon='magnifying-glass'/>

                        <span>Поиск</span>
                    </div>

                    <div className={classes.icon}>
                        <Link to={RouteNames.P_FAVORITE} title='Избранное'>
                            <FontAwesomeIcon icon='heart'/>
                            <span>Избранное</span>
                        </Link>
                    </div>

                    <div className={classes.icon}
                         title='Выход'
                         onClick={logout.bind(this)}
                    >
                        <FontAwesomeIcon icon='right-from-bracket'/>
                        <span>Выход</span>
                    </div>
                </div>

                <div className={classes.profile}
                     title={`Редактировать профиль: ${userData.name}`}
                     onClick={() => {
                         if (userData && userData.id) {
                             setShowUserPanel(!showUserPanel)
                         }
                     }}
                     ref={refProfile}
                >
                    <Avatar href={userData?.avatar ? userData.avatar.content : null}
                            alt={userData?.name}
                            width={46}
                            height={46}
                    />
                </div>

                <ul className={classes.menu}>
                    {menuPanel.map((link: IMenuLink, index: number) => {
                        if (!allowForRole(link.hasRole) || !allowForTariff(link.hasTariff)) {
                            return null
                        }

                        if (link.isSeparator) {
                            return <li key={`separator-${index}`} className={classes.spacer}/>
                        }

                        return (
                            <li key={link.route}>
                                <NavLink to={link.route}
                                         className={({isActive}) => isActive ? classes.active : ''}
                                         title={link.text || link.title}
                                         onClick={onHideMobileMenuHandler.bind(this)}
                                >
                                    {link.icon ?
                                        <span className={classes.icon}>
                                            <FontAwesomeIcon icon={link.icon}/>
                                        </span>
                                        : null
                                    }

                                    <span className={classes.title}>{link.text}</span>
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </>
    )
}

Navigation.displayName = 'Navigation'

export default React.memo(Navigation)
