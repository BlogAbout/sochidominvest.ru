import React from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {RouteNames} from '../../../../../helpers/routerHelper'
import Wrapper from '../../../../ui/Wrapper/Wrapper'
import Grid from '../../../../ui/Grid/Grid'
import GridColumn from '../../../../ui/Grid/components/GridColumn/GridColumn'
import Title from '../../../../ui/Title/Title'
import Contacts from '../../../../ui/Contacts/Contacts'
import Button from '../../../../form/Button/Button'
import openPopupAuth from '../../../../popup/PopupAuth/PopupAuth'
import classes from './SectionBanner.module.scss'

const SectionBanner: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const {isAuth} = useTypedSelector(state => state.userReducer)

    const signInHandler = (): void => {
        if (isAuth) {
            navigate(RouteNames.P_DESKTOP)
        } else {
            openPopupAuth(document.body, {})
        }
    }

    return (
        <section className={classes.SectionBanner}>
            <Wrapper>
                <div className={classes.inner}>
                    <Grid className={classes.cols} isVerticalCenter>
                        <GridColumn width='100%'>
                            <div className={classes.title}>
                                <Title type='h1'
                                       className={classes.title}
                                >Инвестиционные проекты Сочи</Title>
                            </div>

                            <Contacts align='center'/>

                            <div className={classes.buttons}>
                                <Button type='apply' onClick={() => signInHandler()}>Войти в систему</Button>
                            </div>
                        </GridColumn>
                    </Grid>
                </div>
            </Wrapper>
        </section>
    )
}

SectionBanner.displayName = 'SectionBanner'

export default React.memo(SectionBanner)
