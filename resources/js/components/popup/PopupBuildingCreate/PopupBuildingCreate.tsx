import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import classNames from 'classnames/bind'
import BuildingService from '../../../api/BuildingService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IBuilding, IBuildingPassed, IBuildingRent} from '../../../@types/IBuilding'
import {ITab} from '../../../@types/ITab'
import {ISelector} from '../../../@types/ISelector'
import {IAttachment} from '../../../@types/IAttachment'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import NumberBox from '../../form/NumberBox/NumberBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import ComboBox from '../../form/ComboBox/ComboBox'
import Tabs from '../../ui/Tabs/Tabs'
import TagBox from '../../form/TagBox/TagBox'
import Empty from '../../ui/Empty/Empty'
import CheckerList from './components/CheckerList/CheckerList'
import DeveloperList from './components/DeveloperList/DeveloperList'
import AgentList from './components/AgentList/AgentList'
import DocumentList from './components/DocumentList/DocumentList'
import UserList from './components/UserList/UserList'
import SelectorBox from '../../form/SelectorBox/SelectorBox'
import TextAreaBox from '../../form/TextAreaBox/TextAreaBox'
import PassedBox from '../../form/PassedBox/PassedBox'
import FileList from '../../ui/FileList/FileList'
import openPopupAlert from '../../popup/PopupAlert/PopupAlert'
import openPopupFileManager from '../PopupFileManager/PopupFileManager'
import openPopupBuildingRent from '../PopupBuildingRent/PopupBuildingRent'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import ArticleList from './components/ArticleList/ArticleList'
import AddressBox from '../../form/AddressBox/AddressBox'
import {
    amountContract,
    buildingAdvantages,
    buildingClasses,
    buildingElectricity,
    buildingEntrance,
    buildingFormat,
    buildingGas,
    buildingHeating,
    buildingMaterials,
    buildingParking,
    buildingSewerage,
    buildingStatuses,
    buildingTerritory,
    buildingWaterSupply,
    districtList,
    formalizationList,
    paymentsList
} from '../../../helpers/buildingHelper'
import {sortAttachments} from '../../../helpers/attachmentHelper'
import classes from './PopupBuildingCreate.module.scss'

interface Props extends PopupProps {
    building?: IBuilding | null
    type?: 'building' | 'apartment' | 'house' | 'land' | 'commerce' | 'garage'

    onSave(): void
}

const defaultProps: Props = {
    building: null,
    type: 'building',
    onSave: () => {
        console.info('PopupBuildingCreate onSave')
    }
}

const cx = classNames.bind(classes)

const PopupBuildingCreate: React.FC<Props> = (props) => {
    const [building, setBuilding] = useState<IBuilding>(props.building ? JSON.parse(JSON.stringify(props.building)) : {
        id: null,
        name: '',
        description: '',
        address: '',
        coordinates: '',
        type: props.type || 'building',
        status: 'sold',
        is_active: 1,
        area: 0,
        cost: 0,
        info: {
            advantages: [],
            surcharge_doc: 0,
            surcharge_gas: 0
        },
        image_ids: [],
        video_ids: [],
        developer_ids: [],
        agent_ids: [],
        contact_ids: [],
        document_ids: [],
        article_ids: [],
        tag_ids: []
    })

    const [fetchingBuilding, setFetchingBuilding] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        if (building.images && building.images.length) {
            checkAvatar()
        }
    }, [building.images])

    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    const saveHandler = (isClose?: boolean) => {
        if (building.name.trim() === '' || !building.address || building.address.trim() === '') {
            return
        }

        setFetchingBuilding(true)

        BuildingService.saveBuilding(building)
            .then((response: any) => {
                setBuilding(response.data.data)

                props.onSave()

                if (isClose) {
                    close()
                }
            })
            .catch((error: any) => {
                console.error('error', error)
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data.data
                })
            })
            .finally(() => setFetchingBuilding(false))
    }

    // Добавление файла
    const addAttachmentHandler = (attachment: IAttachment) => {
        if (attachment.id) {
            switch (attachment.type) {
                case 'image':
                    const image_ids: number[] = building.image_ids ? [...building.image_ids] : []
                    const images: IAttachment[] = building.images ? [...building.images] : []
                    setBuilding({
                        ...building,
                        image_ids: [attachment.id, ...image_ids],
                        images: [attachment, ...images]
                    })
                    break
                case 'video':
                    const video_ids: number[] = building.video_ids ? [...building.video_ids] : []
                    const videos: IAttachment[] = building.videos ? [...building.videos] : []
                    setBuilding({
                        ...building,
                        video_ids: [attachment.id, ...video_ids],
                        videos: [attachment, ...videos]
                    })
                    break
            }
        }
    }

    // Смена главного изображения
    const selectImageAvatarHandler = (attachment: IAttachment) => {
        setBuilding({...building, info: {...building.info, avatar_id: attachment.id, avatar: attachment}})
    }

    // Проверка наличия главного изображения
    const checkAvatar = () => {
        if (building.images && building.images.length && building.image_ids && building.image_ids.length) {
            if (!building.info.avatar_id || !building.image_ids.includes(building.info.avatar_id)) {
                selectImageAvatarHandler(building.images[0])
            }
        } else {
            setBuilding({
                ...building,
                info: {
                    ...building.info,
                    avatar_id: null,
                    avatar: null
                }
            })
        }
    }

    const isDisableButton = () => {
        return fetchingBuilding || building.name.trim() === '' || !building.address || building.address.trim() === ''
    }

    const onUpdateOrderingImagesHandler = (files: IAttachment[]) => {
        const ids: number[] = []
        files.forEach((attachment: IAttachment) => {
            if (attachment.id) {
                ids.push(attachment.id)
            }
        })
        setBuilding({...building, image_ids: ids, images: sortAttachments(files, ids)})
    }

    const onUpdateOrderingVideosHandler = (files: IAttachment[]) => {
        const ids: number[] = []
        files.forEach((attachment: IAttachment) => {
            if (attachment.id) {
                ids.push(attachment.id)
            }
        })
        setBuilding({...building, video_ids: ids, videos: sortAttachments(files, ids)})
    }

    const removeSelectedImageHandler = (file: IAttachment) => {
        if (file.id) {
            const image_ids: number[] = building.image_ids ? building.image_ids.filter((id: number) => id !== file.id) : []
            const images: IAttachment[] = building.images ? building.images.filter((attachment: IAttachment) => attachment.id !== file.id) : []
            setBuilding({
                ...building,
                image_ids: image_ids,
                images: images
            })
        }
    }

    const removeSelectedVideoHandler = (file: IAttachment) => {
        if (file.id) {
            const video_ids: number[] = building.video_ids ? building.video_ids.filter((id: number) => id !== file.id) : []
            const videos: IAttachment[] = building.videos ? building.videos.filter((attachment: IAttachment) => attachment.id !== file.id) : []
            setBuilding({
                ...building,
                video_ids: video_ids,
                videos: videos
            })
        }
    }

    const getPopupTitle = (): string => {
        let title = 'Добавить '

        if (building.id) {
            title = 'Редактировать '
        }

        switch (building.type) {
            case 'building':
                title += 'жилой комплекс'
                break
            case 'apartment':
                title += 'квартиру'
                break
            case 'house':
                title += 'дом'
                break
            case 'land':
                title += 'земельный участок'
                break
            case 'commerce':
                title += 'коммерцию'
                break
            case 'garage':
                title += 'гараж/машиноместо'
                break
        }

        return title
    }

    // Вкладка состояния объекта
    const renderStateTab = () => {
        return (
            <div key='state' className={classes.tabContent}>
                <div className={classes.field}>
                    <Label text='Название'/>

                    <TextBox value={building.name}
                             onChange={(value: string) => setBuilding({
                                 ...building,
                                 name: value
                             })}
                             placeHolder='Введите название'
                             error={building.name.trim() === ''}
                             showRequired
                             errorText='Поле обязательно для заполнения'
                             styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Адрес'/>

                    <AddressBox address={building.address || ''}
                                coordinates={building.coordinates || ''}
                                onSelect={(address: string, coordinates: string) => setBuilding({
                                    ...building,
                                    address: address,
                                    coordinates: coordinates
                                })}
                                placeHolder='Укажите адрес'
                                error={!building.address || building.address.trim() === ''}
                                showRequired
                                errorText='Поле обязательно для заполнения'
                                styleType='minimal'
                    />
                </div>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Описание'/>

                    <TextAreaBox value={building.description}
                                 onChange={(value: string) => setBuilding({
                                     ...building,
                                     description: value
                                 })}
                                 placeHolder='Введите описание об объекте'
                                 icon='paragraph'
                                 isVisual={true}
                                 width='100%'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Статус'/>

                    <ComboBox selected={building.status || ''}
                              items={buildingStatuses}
                              onSelect={(value: string) => setBuilding({...building, status: value})}
                              placeHolder='Выберите статус'
                              styleType='minimal'
                    />
                </div>

                {building.type !== 'land' ?
                    <div className={classes.field}>
                        <Label text='Дата сдачи'/>

                        <PassedBox selected={building.info.passed || null}
                                   onChange={(value: IBuildingPassed) => setBuilding({
                                       ...building,
                                       info: {...building.info, passed: value}
                                   })}
                                   placeHolder='Укажите дату сдачи'
                                   styleType='minimal'
                        />
                    </div>
                    : null
                }

                <div className={classes.field}>
                    <Label text='Теги'/>

                    <TagBox tags={building.tag_ids || []}
                            onSelect={(value: number[]) => setBuilding({...building, tag_ids: value})}
                            placeHolder='Выберите теги'
                            multi
                            styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Сумма в договоре'/>

                    <ComboBox selected={building.info.amount_contract || null}
                              items={amountContract}
                              onSelect={(value: string) => setBuilding({
                                  ...building,
                                  info: {...building.info, amount_contract: value}
                              })}
                              placeHolder='Выберите сумму в договоре'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Доплата за документы, руб.'/>

                    <NumberBox value={building.info.surcharge_doc || ''}
                               min={0}
                               step={1}
                               max={999999999}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                   ...building,
                                   info: {
                                       ...building.info,
                                       surcharge_doc: value
                                   }
                               })}
                               placeHolder='Введите размер доплаты за документы'
                               styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Доплата за газ, руб.'/>

                    <NumberBox value={building.info.surcharge_gas || ''}
                               min={0}
                               step={1}
                               max={999999999}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                   ...building,
                                   info: {
                                       ...building.info,
                                       surcharge_gas: value
                                   }
                               })}
                               placeHolder='Введите размер доплаты за газ'
                               styleType='minimal'
                    />
                </div>

                {building.type === 'land' ?
                    <div className={classes.field}>
                        <Label text='Кадастровый номер'/>

                        <TextBox value={building.info.cadastral_number || ''}
                                 onChange={(value: string) => setBuilding({
                                     ...building,
                                     info: {
                                         ...building.info,
                                         cadastral_number: value
                                     }
                                 })}
                                 placeHolder='Введите кадастровый номер'
                                 styleType='minimal'
                        />
                    </div>
                    : null
                }

                {building.type === 'land' ?
                    <div className={classes.field}>
                        <Label text='Кадастровая стоимость, руб.'/>

                        <NumberBox value={building.info.cadastral_cost || ''}
                                   min={0}
                                   step={0.01}
                                   max={999999999}
                                   countAfterComma={2}
                                   onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                       ...building,
                                       info: {
                                           ...building.info,
                                           cadastral_cost: value
                                       }
                                   })}
                                   placeHolder='Введите кадастровую стоимость'
                                   styleType='minimal'
                        />
                    </div>
                    : null
                }

                {building.type !== 'building' ?
                    <div className={classes.field}>
                        <CheckBox label='Сдается в аренду'
                                  title='Сдается в аренду'
                                  type='modern'
                                  width={110}
                                  checked={!!building.is_rent}
                                  onChange={() => {
                                      openPopupBuildingRent(document.body, {
                                          building: building,
                                          onSave: (active: number, rentData: IBuildingRent) => {
                                              setBuilding({
                                                  ...building,
                                                  is_rent: active,
                                                  rentData: rentData
                                              })
                                          }
                                      })
                                  }}
                        />
                    </div>
                    : null
                }

                <div className={classes.field}>
                    <CheckBox label='Продажа для нерезидентов'
                              title='Продажа для нерезидентов'
                              type='modern'
                              width={110}
                              checked={!!building.info.is_sale_no_resident}
                              onChange={(e: React.MouseEvent, value: boolean) => setBuilding({
                                  ...building,
                                  info: {
                                      ...building.info,
                                      is_sale_no_resident: value ? 1 : 0
                                  }
                              })}
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Публичный'
                              type='modern'
                              width={110}
                              checked={!!building.is_publish}
                              onChange={(e: React.MouseEvent, value: boolean) => setBuilding({
                                  ...building,
                                  is_publish: value ? 1 : 0
                              })}
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Активен'
                              type='modern'
                              width={110}
                              checked={!!building.is_active}
                              onChange={(e: React.MouseEvent, value: boolean) => setBuilding({
                                  ...building,
                                  is_active: value ? 1 : 0
                              })}
                    />
                </div>
            </div>
        )
    }

    // Вкладка информации объекта
    const renderInformationTab = () => {
        const districtZones = districtList.find((item: ISelector) => item.key === building.info.district)

        return (
            <div key='info' className={classes.tabContent}>
                {building.type !== 'building' ?
                    <>
                        <div className={classes.field}>
                            <Label text='Площадь, м<sup>2</sup>'/>

                            <NumberBox value={building.area || ''}
                                       min={0}
                                       step={0.01}
                                       max={999999999}
                                       countAfterComma={2}
                                       onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                           ...building,
                                           area: value
                                       })}
                                       placeHolder='Введите площадь'
                                       styleType='minimal'
                            />
                        </div>

                        <div className={classes.field}>
                            <Label text='Стоимость, руб.'/>

                            <NumberBox value={building.cost || ''}
                                       min={0}
                                       step={1}
                                       max={999999999}
                                       onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                           ...building,
                                           cost: value
                                       })}
                                       placeHolder='Введите стоимость'
                                       styleType='minimal'
                            />
                        </div>
                    </>
                    : null
                }

                <div className={classes.field}>
                    <Label text='Район'/>

                    <ComboBox selected={building.info.district || null}
                              items={districtList}
                              onSelect={(value: string) => setBuilding({
                                  ...building,
                                  info: {...building.info, district: value}
                              })}
                              placeHolder='Выберите район'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Микрорайон'/>

                    <ComboBox selected={building.info.district_zone || null}
                              items={districtZones && districtZones.children ? districtZones.children : []}
                              onSelect={(value: string) => setBuilding({
                                  ...building,
                                  info: {...building.info, district_zone: value}
                              })}
                              placeHolder='Выберите микрорайон'
                              styleType='minimal'
                              showEmpty
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Особенности'/>

                    <SelectorBox selected={building.info.advantages || []}
                                 items={buildingAdvantages}
                                 onSelect={(value: string[]) => setBuilding({
                                     ...building,
                                     info: {
                                         ...building.info,
                                         advantages: value
                                     }
                                 })}
                                 title='Выберите особенности'
                                 placeHolder='Выберите особенности'
                                 multi
                                 styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Варианты оплаты'/>

                    <SelectorBox selected={building.info.payments || []}
                                 items={paymentsList}
                                 onSelect={(value: string[]) => setBuilding({
                                     ...building,
                                     info: {
                                         ...building.info,
                                         payments: value
                                     }
                                 })}
                                 title='Выберите варианты оплаты'
                                 placeHolder='Выберите варианты оплаты'
                                 multi
                                 styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Варианты оформления покупки'/>

                    <SelectorBox selected={building.info.formalization || []}
                                 items={formalizationList}
                                 onSelect={(value: string[]) => setBuilding({
                                     ...building,
                                     info: {
                                         ...building.info,
                                         formalization: value
                                     }
                                 })}
                                 title='Выберите варианты оформления покупки'
                                 placeHolder='Выберите варианты оформления покупки'
                                 multi
                                 styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Класс дома'/>

                    <ComboBox selected={building.info.house_class || ''}
                              items={buildingClasses}
                              onSelect={(value: string) => setBuilding({
                                  ...building,
                                  info: {...building.info, house_class: value}
                              })}
                              placeHolder='Выберите класс дома'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Материал здания'/>

                    <ComboBox selected={building.info.material || ''}
                              items={buildingMaterials}
                              onSelect={(value: string) => setBuilding({
                                  ...building,
                                  info: {...building.info, material: value}
                              })}
                              placeHolder='Выберите тип материала здания'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Тип дома'/>

                    <ComboBox selected={building.info.house_type || ''}
                              items={buildingFormat}
                              onSelect={(value: string) => setBuilding({
                                  ...building,
                                  info: {...building.info, house_type: value}
                              })}
                              placeHolder='Выберите тип дома'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Паркинг'/>

                    <ComboBox selected={building.info.parking || ''}
                              items={buildingParking}
                              onSelect={(value: string) => setBuilding({
                                  ...building,
                                  info: {...building.info, parking: value}
                              })}
                              placeHolder='Выберите тип паркинга'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Территория'/>

                    <ComboBox selected={building.info.territory || ''}
                              items={buildingTerritory}
                              onSelect={(value: string) => setBuilding({
                                  ...building,
                                  info: {...building.info, territory: value}
                              })}
                              placeHolder='Выберите тип территории'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Подъезд к дому'/>

                    <ComboBox selected={building.info.entrance_house || ''}
                              items={buildingEntrance}
                              onSelect={(value: string) => setBuilding({
                                  ...building,
                                  info: {...building.info, entrance_house: value}
                              })}
                              placeHolder='Выберите тип подъезда к дому'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Газ'/>

                    <ComboBox selected={building.info.gas || ''}
                              items={buildingGas}
                              onSelect={(value: string) => setBuilding({
                                  ...building,
                                  info: {...building.info, gas: value}
                              })}
                              placeHolder='Выберите подключение газа'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Отопление'/>

                    <ComboBox selected={building.info.heating || ''}
                              items={buildingHeating}
                              onSelect={(value: string) => setBuilding({
                                  ...building,
                                  info: {...building.info, heating: value}
                              })}
                              placeHolder='Выберите тип отопления'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Электричество'/>

                    <ComboBox selected={building.info.electricity || ''}
                              items={buildingElectricity}
                              onSelect={(value: string) => setBuilding({
                                  ...building,
                                  info: {...building.info, electricity: value}
                              })}
                              placeHolder='Выберите тип электричества'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Канализация'/>

                    <ComboBox selected={building.info.sewerage || ''}
                              items={buildingSewerage}
                              onSelect={(value: string) => setBuilding({
                                  ...building,
                                  info: {...building.info, sewerage: value}
                              })}
                              placeHolder='Выберите тип канализации'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Водоснабжение'/>

                    <ComboBox selected={building.info.water_supply || ''}
                              items={buildingWaterSupply}
                              onSelect={(value: string) => setBuilding({
                                  ...building,
                                  info: {...building.info, water_supply: value}
                              })}
                              placeHolder='Выберите тип водоснабжения'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Расстояние до моря, м.'/>

                    <NumberBox value={building.info.distance_sea || ''}
                               min={0}
                               step={1}
                               max={999999999}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                   ...building,
                                   info: {
                                       ...building.info,
                                       distance_sea: value
                                   }
                               })}
                               placeHolder='Укажите расстояние до моря'
                               styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Высота потолков, м.'/>

                    <NumberBox value={building.info.ceiling_height || ''}
                               min={0}
                               step={0.01}
                               max={99}
                               countAfterComma={2}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                   ...building,
                                   info: {
                                       ...building.info,
                                       ceiling_height: value
                                   }
                               })}
                               placeHolder='Укажите высоту потолков'
                               styleType='minimal'
                    />
                </div>
            </div>
        )
    }

    // Вкладка шахматки объекта
    const renderCheckerBoardTab = () => {
        return (
            <div key='checker' className={classes.tabContent}>
                {building.id ?
                    <CheckerList buildingId={building.id}/>
                    : <Empty message='Для получения доступа к шахматке сохраните изменения'/>
                }
            </div>
        )
    }

    // Вкладка галереии объекта
    const renderMediaTab = () => {
        return (
            <div key='media' className={classes.tabContent}>
                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Фотогалерея'/>

                    <Button type='save'
                            icon='arrow-pointer'
                            onClick={() => openPopupFileManager(document.body, {
                                type: 'image',
                                selected: building.image_ids || [],
                                onSelect: (selected: number[], attachments: IAttachment[]) => {
                                    setBuilding({
                                        ...building,
                                        image_ids: selected,
                                        images: attachments
                                    })
                                },
                                multi: true
                            })}
                            disabled={isDisableButton()}
                    >Выбрать / Загрузить</Button>

                    <FileList files={building.images || []}
                              selected={building.info.avatar_id ? [building.info.avatar_id] : []}
                              fetching={fetchingBuilding}
                              onSave={addAttachmentHandler.bind(this)}
                              onSelect={selectImageAvatarHandler.bind(this)}
                              onRemove={removeSelectedImageHandler.bind(this)}
                              onUpdateOrdering={onUpdateOrderingImagesHandler.bind(this)}
                              isOnlyList={true}
                    />
                </div>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Видео'/>

                    <Button type='save'
                            icon='arrow-pointer'
                            onClick={() => openPopupFileManager(document.body, {
                                type: 'video',
                                selected: building.video_ids || [],
                                onSelect: (selected: number[], attachments: IAttachment[]) => {
                                    setBuilding({
                                        ...building,
                                        video_ids: selected,
                                        videos: attachments
                                    })
                                },
                                multi: true
                            })}
                            disabled={isDisableButton()}
                    >Выбрать / Загрузить</Button>

                    <FileList files={building.videos || []}
                              fetching={fetchingBuilding}
                              onSave={addAttachmentHandler.bind(this)}
                              onSelect={selectImageAvatarHandler.bind(this)}
                              onRemove={removeSelectedVideoHandler.bind(this)}
                              onUpdateOrdering={onUpdateOrderingVideosHandler.bind(this)}
                              isOnlyList={true}
                    />
                </div>
            </div>
        )
    }

    // Вкладка застройщика объекта
    const renderDeveloperTab = () => {
        return (
            <div key='developer' className={classes.tabContent}>
                <DeveloperList selected={building.developer_ids || []}
                               onSelect={(value: number[]) => setBuilding({...building, developer_ids: value})}
                />
            </div>
        )
    }

    // Вкладка агентства объекта
    const renderAgentTab = () => {
        return (
            <div key='agent' className={classes.tabContent}>
                <AgentList selected={building.agent_ids || []}
                           onSelect={(value: number[]) => setBuilding({...building, agent_ids: value})}
                />
            </div>
        )
    }

    // Вкладка контактов объекта
    const renderContactTab = () => {
        return (
            <div key='contact' className={classes.tabContent}>
                <UserList selectedAgents={building.agent_ids || []}
                          selectedUsers={[]}
                          selectedContacts={building.contact_ids || []}
                          onSelectUsers={(value: number[]) => {
                          }}
                          onSelectContacts={(value: number[]) => setBuilding({...building, contact_ids: value})}
                />
            </div>
        )
    }

    // Вкладка документов объекта
    const renderDocumentTab = () => {
        return (
            <div key='document' className={classes.tabContent}>
                {building.id ?
                    <DocumentList buildingId={building.id}/>
                    : <Empty message='Для получения доступа к документам сохраните изменения'/>
                }
            </div>
        )
    }

    // Вкладка статей объекта
    const renderArticleTab = () => {
        return (
            <div key='article' className={classes.tabContent}>
                <ArticleList selected={building.article_ids || []}
                             onSelect={(value: number[]) => setBuilding({...building, article_ids: value})}
                />
            </div>
        )
    }

    const renderSeoTab = () => {
        return (
            <div key='seo' className={classes.tabContent}>
                <div>
                    <div className={classes.field}>
                        <Label text='Meta Title'/>

                        <TextBox value={building.meta_title || ''}
                                 onChange={(value: string) => setBuilding({
                                     ...building,
                                     meta_title: value
                                 })}
                                 placeHolder='Введите Meta Title'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={cx({'field': true, 'fieldWrap': true})}>
                        <Label text='Meta Description'/>

                        <TextAreaBox value={building.meta_description || ''}
                                     onChange={(value: string) => setBuilding({
                                         ...building,
                                         meta_description: value
                                     })}
                                     placeHolder='Введите Meta Description'
                                     width='100%'
                        />
                    </div>
                </div>
            </div>
        )
    }

    const tabs: ITab = {
        state: {title: 'Состояние', render: renderStateTab()},
        info: {title: 'Информация', render: renderInformationTab()},
        checker: {title: 'Шахматка', render: renderCheckerBoardTab()},
        media: {title: 'Медиа', render: renderMediaTab()},
        developer: {title: 'Застройщик', render: renderDeveloperTab()},
        agent: {title: 'Агентство', render: renderAgentTab()},
        contact: {title: 'Контакты', render: renderContactTab()},
        documents: {title: 'Документы', render: renderDocumentTab()},
        articles: {title: 'Статьи', render: renderArticleTab()},
        seo: {title: 'СЕО', render: renderSeoTab()}
    }

    if (building.type !== 'building') {
        delete tabs.checker
    }

    return (
        <Popup className={classes.PopupBuildingCreate}>
            <BlockingElement fetching={fetchingBuilding} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type='h2'>{getPopupTitle()}</Title>

                    <Tabs tabs={tabs} paddingFirstTab='popup'/>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={isDisableButton()}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={isDisableButton()}
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

PopupBuildingCreate.defaultProps = defaultProps
PopupBuildingCreate.displayName = 'PopupBuildingCreate'

export default function openPopupBuildingCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupBuildingCreate), popupProps, undefined, block, displayOptions)
}
