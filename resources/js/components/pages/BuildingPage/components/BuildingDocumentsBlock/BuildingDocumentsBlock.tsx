import React from 'react'
import {IDocument} from '../../../../../@types/IDocument'
import {IBuilding} from '../../../../../@types/IBuilding'
import {configuration} from '../../../../../helpers/utilHelper'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import Empty from '../../../../../components/ui/Empty/Empty'
import Title from '../../../../ui/Title/Title'
import classes from './BuildingDocumentsBlock.module.scss'

interface Props {
    building: IBuilding
}

const defaultProps: Props = {
    building: {} as IBuilding
}

const BuildingDocumentsBlock: React.FC<Props> = (props): React.ReactElement => {
    return (
        <BlockingElement fetching={false} className={classes.BuildingDocumentsBlock}>
            <Title type='h2'>Документы</Title>

            {props.building.documents && props.building.documents.length ?
                props.building.documents.map((document: IDocument) => {
                    if (document.attachment) {
                        if (document.type === 'file') {
                            return (
                                <p key={document.id}>
                                    <a href={`${configuration.apiUrl}uploads/document/${document.attachment.content}`}
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
                    }
                })
                : <Empty message='Отсутствует информация о документах'/>
            }
        </BlockingElement>
    )
}

BuildingDocumentsBlock.defaultProps = defaultProps
BuildingDocumentsBlock.displayName = 'BuildingDocumentsBlock'

export default React.memo(BuildingDocumentsBlock)
