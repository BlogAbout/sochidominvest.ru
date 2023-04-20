import React, {useRef} from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
// import Resizer from 'react-image-file-resizer'
import {IImage, IImageDb} from '../../../@types/IImage'
import Button from '../../form/Button/Button'
import Preloader from '../Preloader/Preloader'
import Empty from '../Empty/Empty'
import classes from './ImageUploader.module.scss'
import {configuration} from "../../../helpers/utilHelper";

interface Props {
    images: IImageDb[]
    newImages: IImage[]
    multi?: boolean
    type?: 'image' | 'document'
    objectType: string
    showUploadList?: boolean
    disabled?: boolean
    text?: string
    fetching?: boolean

    onChange(updateImages: IImageDb[], uploadImages: IImage[]): void

    onClickImage?(index: number, type: string): void
}

const defaultProps: Props = {
    images: [],
    newImages: [],
    multi: false,
    type: 'image',
    objectType: 'building',
    showUploadList: false,
    disabled: false,
    text: 'Загрузить',
    fetching: false,
    onChange: (updateImages: IImageDb[], uploadImages: IImage[]) => {
        console.info('ImageUploader onChange', updateImages, uploadImages)
    }
}

const cx = classNames.bind(classes)

const ImageUploader: React.FC<Props> = (props) => {
    const inputRef = useRef<HTMLInputElement | null>(null)

    const accept = !props.type || props.type === 'image' ? 'image/jpeg,image/png,image/jpg' : ''
    const acceptText = !props.type || props.type === 'image' ? 'Доступны для загрузки: PNG, JPG, JPEG' : ''

    const resizeFile = (file: File) =>
        new Promise((resolve) => {
            // Resizer.imageFileResizer(
            //     file,
            //     2000,
            //     2000,
            //     'JPEG',
            //     95,
            //     0,
            //     (uri) => {
            //         resolve(uri)
            //     },
            //     'base64'
            // )
        })

    // Загрузчик изображений
    const uploadImagesHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const imagesList: IImage[] = []
        const files: FileList | null = e.currentTarget.files

        if (files && files.length) {
            for (const file of Array.from(files)) {
                const image = await resizeFile(file)
                imagesList.push({name: file.name, value: image, avatar: 0, objectType: props.objectType})
            }
        }

        if (inputRef && inputRef.current) {
            inputRef.current.value = ''
        }

        props.onChange(props.images, [...props.newImages, ...imagesList])
    }

    // Удаление изображения
    const removeImageHandler = (index: number, upload: boolean) => {
        let updateImages = [...props.images]
        let uploadImages = [...props.newImages]

        if (upload) {
            uploadImages.splice(index, 1)
        } else {
            updateImages[index].active = 0
        }

        props.onChange(updateImages, uploadImages)
    }

    const renderUploadList = () => {
        if (!props.showUploadList) {
            return null
        }

        return (
            <div className={classes.list}>
                {props.fetching && <Preloader/>}

                {!props.images.length && !props.newImages.length && <Empty message='Нет загруженных изображений'/>}

                {props.images.length ?
                    props.images.map((image: IImageDb, index: number) => {
                        if (image.active !== 1) {
                            return null
                        }

                        return (
                            <div key={'selected-' + image.id}
                                 className={cx({'item': true, 'avatar': !!image.avatar})}
                            >
                                <div className={classes.wrapper}
                                     onClick={() => {
                                         if (props.onClickImage != undefined) {
                                             props.onClickImage(index, 'selected')
                                         }
                                     }}
                                >
                                    <img src={configuration.apiUrl + image.value} alt={image.name}/>
                                </div>

                                <div className={classes.remove}
                                     title='Удалить'
                                     onClick={() => removeImageHandler(index, false)}
                                >
                                    <FontAwesomeIcon icon='trash'/>
                                </div>
                            </div>
                        )
                    })
                    : null
                }

                {props.newImages.length ?
                    props.newImages.map((image: IImage, index: number) => {
                        return (
                            <div key={'upload-' + index}
                                 className={cx({'item': true, 'avatar': !!image.avatar})}
                            >
                                <div className={classes.wrapper}
                                     onClick={() => {
                                         if (props.onClickImage != undefined) {
                                             props.onClickImage(index, 'upload')
                                         }
                                     }}
                                >
                                    <img src={image.value} alt={image.name}/>
                                </div>

                                <div className={classes.remove}
                                     title='Удалить'
                                     onClick={() => removeImageHandler(index, true)}
                                >
                                    <FontAwesomeIcon icon='trash'/>
                                </div>
                            </div>
                        )
                    })
                    : null
                }
            </div>
        )
    }

    const renderInput = () => {
        return (
            <div className={classes.field}>
                <input type='file'
                       multiple={props.multi}
                       accept={accept}
                       disabled={props.disabled}
                       onChange={uploadImagesHandler.bind(this)}
                       ref={inputRef}
                />

                <Button type='apply'
                        icon='upload'
                        onClick={() => inputRef.current?.click()}
                        disabled={props.disabled || props.fetching}
                        title={acceptText}
                >{props.text}</Button>
            </div>
        )
    }

    return (
        <div className={classes.ImageUploader}>
            {renderUploadList()}
            {renderInput()}
        </div>
    )
}

ImageUploader.defaultProps = defaultProps
ImageUploader.displayName = 'ImageUploader'

export default ImageUploader
