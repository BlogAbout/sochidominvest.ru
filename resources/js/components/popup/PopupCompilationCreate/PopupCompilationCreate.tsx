import React, {useEffect, useState} from 'react'
import classNames from 'classnames/bind'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {ICompilation} from '../../../@types/ICompilation'
import {IBuilding} from '../../../@types/IBuilding'
import CompilationService from '../../../api/CompilationService'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import TextAreaBox from '../../form/TextAreaBox/TextAreaBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import classes from './PopupCompilationCreate.module.scss'

interface Props extends PopupProps {
    compilation?: ICompilation | null

    onSave(): void
}

const defaultProps: Props = {
    compilation: null,
    onSave: () => {
        console.info('PopupCompilationCreate onSave')
    }
}

const cx = classNames.bind(classes)

const PopupCompilationCreate: React.FC<Props> = (props) => {
    const [compilation, setCompilation] = useState<ICompilation>({
        id: null,
        name: '',
        description: '',
        is_active: 1
    })
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        if (props.compilation) {
            onUpdateCompilationData(props.compilation)
        }
    }, [props.compilation])

    const onUpdateCompilationData = (compilationData: ICompilation) => {
        const building_ids: number[] = []

        if (compilationData.buildings && compilationData.buildings.length) {
            compilationData.buildings.map((building: IBuilding) => {
                if (building.id) {
                    building_ids.push(building.id)
                }
            })
        }

        setCompilation({
            ...compilationData,
            building_ids: building_ids
        })
    }

    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    const saveHandler = (isClose?: boolean) => {
        setFetching(true)

        CompilationService.saveCompilation(compilation)
            .then((response: any) => {
                onUpdateCompilationData(response.data.data)

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
            .finally(() => setFetching(false))
    }

    return (
        <Popup className={classes.PopupCompilationCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type='h2'>Информация о подборке</Title>

                    <div className={classes.field}>
                        <Label text='Название'/>

                        <TextBox value={compilation.name}
                                 onChange={(value: string) => setCompilation({
                                     ...compilation,
                                     name: value
                                 })}
                                 placeHolder='Введите название'
                                 error={compilation.name.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={cx({'field': true, 'fieldWrap': true})}>
                        <Label text='Описание'/>

                        <TextAreaBox value={compilation.description}
                                     onChange={(value: string) => setCompilation({
                                         ...compilation,
                                         description: value
                                     })}
                                     placeHolder='Введите описание о подборке'
                                     width='100%'
                        />
                    </div>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetching || compilation.name.trim() === ''}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || compilation.name.trim() === ''}
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

PopupCompilationCreate.defaultProps = defaultProps
PopupCompilationCreate.displayName = 'PopupCompilationCreate'

export default function openPopupCompilationCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupCompilationCreate, popupProps, undefined, block, displayOptions)
}
