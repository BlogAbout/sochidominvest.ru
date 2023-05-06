import React, {useState} from 'react'
import {IQuestion} from '../../../../../@types/IQuestion'
import {getQuestionTypeText} from '../../../../../helpers/questionHelper'
import {checkRules, Rules} from '../../../../../helpers/accessHelper'
import QuestionService from '../../../../../api/QuestionService'
import ListHead from '../../../../ui/List/components/ListHead/ListHead'
import ListCell from '../../../../ui/List/components/ListCell/ListCell'
import ListBody from '../../../../ui/List/components/ListBody/ListBody'
import ListRow from '../../../../ui/List/components/ListRow/ListRow'
import List from '../../../../ui/List/List'
import Empty from '../../../../ui/Empty/Empty'
import openPopupAlert from '../../../../popup/PopupAlert/PopupAlert'
import openContextMenu from '../../../../ui/ContextMenu/ContextMenu'
import openPopupQuestionInfo from '../../../../../components/popup/PopupQuestionInfo/PopupQuestionInfo'
import openPopupQuestionCreate from '../../../../../components/popup/PopupQuestionCreate/PopupQuestionCreate'
import classes from './QuestionList.module.scss'

interface Props {
    list: IQuestion[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onSave: () => {
        console.info('MailingList onSave')
    }
}

const QuestionList: React.FC<Props> = (props): React.ReactElement => {
    const [fetching, setFetching] = useState(props.fetching)

    const onEditHandler = (question: IQuestion): void => {
        openPopupQuestionCreate(document.body, {
            question: question,
            onSave: () => props.onSave()
        })
    }

    const onRemoveHandler = (question: IQuestion): void => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить вопрос: "${question.name}"?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (question.id) {
                            setFetching(true)

                            QuestionService.removeQuestion(question.id)
                                .then(() => props.onSave())
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data.message
                                    })
                                })
                                .finally(() => setFetching(false))
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    const onContextMenuHandler = (question: IQuestion, e: React.MouseEvent): void => {
        e.preventDefault()

        const menuItems: any[] = []

        if (checkRules([Rules.EDIT_QUESTION])) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(question)})
        }

        if (checkRules([Rules.REMOVE_QUESTION])) {
            menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(question)})
        }

        openContextMenu(e, menuItems)
    }

    return (
        <List className={classes.QuestionList}>
            <ListHead>
                <ListCell className={classes.name}>Название</ListCell>
                <ListCell className={classes.author}>Автор</ListCell>
                <ListCell className={classes.type}>Тип</ListCell>
            </ListHead>

            <ListBody fetching={props.fetching || fetching}>
                {props.list && props.list.length ?
                    props.list.map((question: IQuestion) => {
                        return (
                            <ListRow key={question.id}
                                     onContextMenu={(e: React.MouseEvent) => onContextMenuHandler(question, e)}
                                     onClick={() => openPopupQuestionInfo(document.body, {
                                         question: question
                                     })}
                                     isDisabled={!question.is_active}
                            >
                                <ListCell className={classes.name}>{question.name}</ListCell>
                                <ListCell
                                    className={classes.author}>{question.author ? question.author.name : ''}</ListCell>
                                <ListCell className={classes.type}>{getQuestionTypeText(question.type)}</ListCell>
                            </ListRow>
                        )
                    })
                    : <Empty message='Нет вопросов'/>
                }
            </ListBody>
        </List>
    )
}

QuestionList.defaultProps = defaultProps
QuestionList.displayName = 'QuestionList'

export default React.memo(QuestionList)
