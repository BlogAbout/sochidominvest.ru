import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import classNames from 'classnames/bind'
import {converter} from '../../../helpers/utilHelper'
import {mailingTypes} from '../../../helpers/mailingHelper'
import MailingService from '../../../api/MailingService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IMailing} from '../../../@types/IMailing'
import {ICompilation} from '../../../@types/ICompilation'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../popup/PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import TextAreaBox from '../../form/TextAreaBox/TextAreaBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import ComboBox from '../../form/ComboBox/ComboBox'
import CompilationBox from '../../form/CompilationBox/CompilationBox'
import classes from './PopupMailingCreate.module.scss'

interface Props extends PopupProps {
    mailing?: IMailing | null

    onSave(): void
}

const defaultProps: Props = {
    mailing: null,
    onSave: () => {
        console.info('PopupMailingCreate onSave')
    }
}

const cx = classNames.bind(classes)

const PopupMailingCreate: React.FC<Props> = (props) => {
    const [mailing, setMailing] = useState<IMailing>(props.mailing || {
        id: null,
        name: '',
        content: '',
        content_html: '',
        type: 'mail',
        status: 0,
        is_active: 1
    })

    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    const saveHandler = (isClose?: boolean) => {
        setFetching(true)

        const saveMailing: IMailing = JSON.parse(JSON.stringify(mailing))

        if (saveMailing.type === 'mail') {
            saveMailing.content_html = converter.makeHtml(saveMailing.content)
        }

        MailingService.saveMailing(saveMailing)
            .then((response: any) => {
                setMailing(response.data.data)

                props.onSave()

                if (isClose) {
                    close()
                }
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data.message
                })
            })
            .finally(() => {
                setFetching(false)
            })
    }

    const renderFieldsMail = () => {
        return (
            <div className={cx({'field': true, 'fieldWrap': true})}>
                <Label text='Содержимое'/>

                <TextAreaBox value={mailing.content}
                             onChange={(value: string) => setMailing({
                                 ...mailing,
                                 content: value
                             })}
                             placeHolder='Введите содержимое рассылки'
                             isVisual={true}
                             width='100%'
                             error={!mailing.content || mailing.content.trim() === ''}
                             showRequired
                             errorText='Поле обязательно для заполнения'
                />
            </div>
        )
    }

    const renderFieldsCompilation = () => {
        return (
            <div className={classes.field}>
                <Label text='Подборка'/>

                <CompilationBox compilations={mailing.content.trim() !== '' ? [+mailing.content] : []}
                                onSelect={(compilations: ICompilation[]) => {
                                    setMailing({
                                        ...mailing,
                                        content: compilations.length && compilations[0].id ? compilations[0].id.toString() : ''
                                    })
                                }}
                                placeHolder='Выберите подборку'
                                error={!mailing.content || mailing.content.trim() === ''}
                                showRequired
                                errorText='Поле обязательно для заполнения'
                                styleType='minimal'
                />
            </div>
        )
    }

    const renderFieldsNotification = () => {
        // Todo
        return (
            <div className={classes.field}>
                <Label text='В разработке'/>

            </div>
        )
    }

    const renderContentFieldsByType = () => {
        switch (mailing.type) {
            case 'mail':
                return renderFieldsMail()
            case 'compilation':
                return renderFieldsCompilation()
            case 'notification':
                return renderFieldsNotification()
        }
    }

    return (
        <Popup className={classes.PopupMailingCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div key='content' className={classes.blockContent}>
                    <Title type='h2'>Информация о рассылке</Title>

                    <div className={classes.field}>
                        <Label text='Название'/>

                        <TextBox value={mailing.name}
                                 onChange={(value: string) => setMailing({
                                     ...mailing,
                                     name: value
                                 })}
                                 placeHolder='Введите название'
                                 error={!mailing.name || mailing.name.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Тип'/>

                        <ComboBox selected={mailing.type}
                                  items={mailingTypes}
                                  onSelect={(value: string) => setMailing({...mailing, type: value, content: ''})}
                                  placeHolder='Выберите тип'
                                  styleType='minimal'
                        />
                    </div>

                    {renderContentFieldsByType()}

                    <div className={classes.field}>
                        <CheckBox label='Активен'
                                  type='modern'
                                  width={110}
                                  checked={!!mailing.is_active}
                                  onChange={(e: React.MouseEvent, value: boolean) => setMailing({
                                      ...mailing,
                                      is_active: value ? 1 : 0
                                  })}
                        />
                    </div>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetching || mailing.name.trim() === '' || mailing.content.trim() === ''}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || mailing.name.trim() === '' || mailing.content.trim() === ''}
                        className='marginLeft'
                        title='Сохранить'
                >Сохранить</Button>

                <Button type='regular'
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                        className='marginLeft'
                        title='Отменить'
                >Отменить</Button>
            </Footer>
        </Popup>
    )
}

PopupMailingCreate.defaultProps = defaultProps
PopupMailingCreate.displayName = 'PopupMailingCreate'

export default function openPopupMailingCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupMailingCreate), popupProps, undefined, block, displayOptions)
}
