import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import TagService from '../../../api/TagService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {ITag} from '../../../@types/ITag'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import classes from './PopupTagCreate.module.scss'

interface Props extends PopupProps {
    tag?: ITag | null

    onSave(): void
}

const defaultProps: Props = {
    tag: null,
    onSave: () => {
        console.info('PopupTagCreate onSave')
    }
}

const PopupTagCreate: React.FC<Props> = (props) => {
    const [tag, setTag] = useState<ITag>(props.tag || {
        id: null,
        name: '',
        is_active: 1
    })

    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    const close = (): void => {
        removePopup(props.id ? props.id : '')
    }

    const saveHandler = (isClose?: boolean): void => {
        if (!tag.name || tag.name.trim() === '') {
            return
        }

        setFetching(true)

        TagService.saveTag(tag)
            .then((response: any) => {
                setTag(response.data.data)

                props.onSave()

                if (isClose) {
                    close()
                }
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data.data
                })
            })
            .finally(() => setFetching(false))
    }

    return (
        <Popup className={classes.PopupTagCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type='h2'>Информация о метке</Title>

                    <div className={classes.field}>
                        <Label text='Название'/>

                        <TextBox value={tag.name}
                                 onChange={(value: string) => setTag({
                                     ...tag,
                                     name: value
                                 })}
                                 placeHolder='Введите название'
                                 error={tag.name.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <CheckBox label='Активен'
                                  type='modern'
                                  width={110}
                                  checked={!!tag.is_active}
                                  onChange={(e: React.MouseEvent, value: boolean) => setTag({
                                      ...tag,
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
                        disabled={fetching || tag.name.trim() === ''}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || tag.name.trim() === ''}
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

PopupTagCreate.defaultProps = defaultProps
PopupTagCreate.displayName = 'PopupTagCreate'

export default function openPopupTagCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupTagCreate), popupProps, undefined, block, displayOptions)
}
