import React, {useEffect, useState} from 'react'
import {ITag} from '../../../@types/ITag'
import openPopupTagSelector from '../../popup/PopupTagSelector/PopupTagSelector'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import Box from '../Box/Box'

interface Props {
    tags?: number[]
    multi?: boolean
    width?: number | string
    margin?: number | string
    flexGrow?: boolean,
    placeHolder?: string
    title?: string
    readOnly?: boolean
    error?: boolean
    showValidate?: boolean
    showRequired?: boolean
    showClear?: boolean
    disableTitle?: boolean
    styleType: 'standard' | 'minimal'

    onSelect(value: number[], e: React.MouseEvent): void
}

const defaultProps: Props = {
    tags: [],
    multi: false,
    styleType: 'standard',
    onSelect: (value: number[], e: React.MouseEvent) => {
        console.info('TagBox onSelect', value, e)
    }
}

const TagBox: React.FC<Props> = (props) => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')

    const {tags} = useTypedSelector(state => state.tagReducer)
    const {fetchTagList} = useActions()

    useEffect(() => {
        if (!tags.length) {
            updateTagListStore()
                .then(() => updateSelectedInfo())
                .catch((error) => {
                    console.error('Ошибка загрузки тегов в store', error)
                })
        } else {
            updateSelectedInfo()
        }
    }, [props.tags])

    useEffect(() => {
        updateSelectedInfo()
    }, [tags])

    const updateTagListStore = async () => {
        await fetchTagList()
    }

    const clickHandler = (e: React.MouseEvent) => {
        openPopupTagSelector(document.body, {
            multi: props.multi,
            selected: props.tags,
            onSelect: (value: number[]) => {
                props.onSelect(value, e)
            }
        })
    }

    const resetHandler = (e: React.MouseEvent) => {
        props.onSelect([], e)
    }

    const updateSelectedInfo = () => {
        let tmpText = ''
        let tmpTitle = ''

        if (props.tags && props.tags.length) {
            const firstTagId: number = props.tags[0]
            const tagsNames: string[] = []
            const tagFirstInfo = tags.find((tag: ITag) => tag.id === firstTagId)

            if (tagFirstInfo) {
                tmpText += tagFirstInfo.name
            }

            if (props.tags.length > 1) {
                tmpText += ` + ещё ${props.tags.length - 1}`
            }

            props.tags.map((id: number) => {
                const tagInfo = tags.find((tag: ITag) => tag.id === id)
                if (tagInfo) {
                    tagsNames.push(tagInfo.name)
                }
            })

            tmpTitle = tagsNames.join('\n')
        }

        setText(tmpText)
        setTitle(tmpTitle)
    }

    const {onSelect, ...otherProps} = props
    return (
        <Box {...otherProps}
             value={text}
             type='picker'
             title={otherProps.title || title}
             onChange={clickHandler.bind(this)}
             onClear={resetHandler.bind(this)}
             showSelect
             styleType={props.styleType}
        />
    )
}

TagBox.defaultProps = defaultProps
TagBox.displayName = 'TagBox'

export default TagBox
