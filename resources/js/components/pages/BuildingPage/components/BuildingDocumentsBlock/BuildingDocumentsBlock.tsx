import React, {useEffect, useState} from 'react'
import {IDocument} from '../../../../../@types/IDocument'
import {IBuilding} from '../../../../../@types/IBuilding'
import {IFilter} from '../../../../../@types/IFilter'
import DocumentService from '../../../../../api/DocumentService'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import Empty from '../../../../../components/ui/Empty/Empty'
import Title from '../../../../ui/Title/Title'
import openPopupAlert from '../../../../popup/PopupAlert/PopupAlert'
import classes from './BuildingDocumentsBlock.module.scss'
import {configuration} from "../../../../../helpers/utilHelper";

interface Props {
    building: IBuilding
}

const defaultProps: Props = {
    building: {} as IBuilding
}

const BuildingDocumentsBlock: React.FC<Props> = (props): React.ReactElement => {
    const [fetching, setFetching] = useState(false)
    const [documents, setDocuments] = useState<IDocument[]>([])

    useEffect(() => {
        onFetchDocuments()
    }, [props.building.id])

    const onFetchDocuments = (): void => {
        if (!props.building || !props.building.id) {
            return
        }

        setFetching(true)

        const filter: IFilter = {
            active: [0, 1],
            object_id: [props.building.id],
            object_type: 'building'
        }

        DocumentService.fetchDocuments(filter)
            .then((response: any) => setDocuments(response.data.data))
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data.data
                })
            })
            .finally(() => setFetching(false))
    }

    return (
        <BlockingElement fetching={fetching} className={classes.BuildingDocumentsBlock}>
            <Title type='h2'>Документы</Title>

            {documents && documents.length ?
                documents.map((document: IDocument) => {
                    if (document.type === 'file') {
                        return (
                            <p key={document.id}>
                                <a href={`${configuration.apiUrl}uploads/document/${document.url}`}
                                   target='_blank'
                                >{document.name}</a>
                            </p>
                        )
                    } else {
                        return (
                            <p key={document.id}>
                                <a href={document.content}
                                   target='_blank'
                                >{document.name}</a>
                            </p>
                        )
                    }
                })
                : <Empty message='Отсутствует информация о документах'/>
            }
        </BlockingElement>
    )
}

BuildingDocumentsBlock.defaultProps = defaultProps
BuildingDocumentsBlock.displayName = 'BuildingDocumentsBlock'

export default BuildingDocumentsBlock
