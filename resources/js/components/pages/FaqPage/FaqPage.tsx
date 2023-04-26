import React, {useEffect, useMemo, useState} from 'react'
import QuestionService from '../../../api/QuestionService'
import {IFilterBase} from '../../../@types/IFilter'
import {IQuestion} from '../../../@types/IQuestion'
import {compareText} from '../../../helpers/filterHelper'
import openPopupQuestionInfo from '../../../components/popup/PopupQuestionInfo/PopupQuestionInfo'
import Title from '../../ui/Title/Title'
import FilterBase from '../../../components/ui/FilterBase/FilterBase'
import Empty from '../../ui/Empty/Empty'
import DefaultView from '../../views/DefaultView/DefaultView'
import Wrapper from '../../ui/Wrapper/Wrapper'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import classes from './FaqPage.module.scss'

const FaqPage: React.FC = (): React.ReactElement => {
    const [questions, setQuestions] = useState<IQuestion[]>()
    const [searchText, setSearchText] = useState('')
    const [filterQuestion, setFilterQuestion] = useState<IQuestion[]>([])
    const [selectedType, setSelectedType] = useState<string>('all')
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        onFetchQuestions()
    }, [])

    useEffect(() => {
        onFiltrationQuestions()
    }, [questions, searchText, selectedType])

    const onFetchQuestions = (): void => {
        setFetching(true)

        QuestionService.fetchQuestions({active: [1]})
            .then((response: any) => setQuestions(response.data.data))
            .catch((error: any) => console.error('Произошла ошибка загрузки данных', error))
            .finally(() => setFetching(false))
    }

    const onFiltrationQuestions = (): void => {
        const resultSearch = search(searchText)

        if (!resultSearch || !resultSearch.length) {
            setFilterQuestion([])
        } else if (!selectedType || selectedType === 'all') {
            setFilterQuestion(resultSearch)
        } else {
            setFilterQuestion(resultSearch.filter((question: IQuestion) => question.type === selectedType))
        }
    }

    const search = (value: string): IQuestion[] => {
        setSearchText(value)

        if (!questions || !questions.length) {
            return []
        }

        if (value !== '') {
            return questions.filter((question: IQuestion) => {
                return compareText(question.name, value) || compareText(question.description, value)
            })
        } else {
            return questions
        }
    }

    const onClickHandler = (question: IQuestion): void => {
        openPopupQuestionInfo(document.body, {
            question: question
        })
    }

    const filterBaseButtons: IFilterBase[] = useMemo((): IFilterBase[] => {
        return [
            {
                key: 'all',
                title: 'Все',
                icon: 'bookmark',
                active: selectedType.includes('all'),
                onClick: () => setSelectedType('all')
            },
            {
                key: 'common',
                title: 'Общие',
                icon: 'bolt',
                active: selectedType.includes('common'),
                onClick: () => setSelectedType('common')
            },
            {
                key: 'payment',
                title: 'Оплата',
                icon: 'money-bill-1-wave',
                active: selectedType.includes('payment'),
                onClick: () => setSelectedType('payment')
            },
            {
                key: 'tariffs',
                title: 'Тарифы',
                icon: 'money-check',
                active: selectedType.includes('tariffs'),
                onClick: () => setSelectedType('tariffs')
            },
            {
                key: 'other',
                title: 'Другое',
                icon: 'star',
                active: selectedType.includes('other'),
                onClick: () => setSelectedType('other')
            }
        ]
    }, [selectedType])

    return (
        <DefaultView pageTitle='Вопрос/Ответ'>
            <Wrapper>
                <div className={classes.inner}>
                    <Title type='h1' style='center'>Вопрос/Ответ</Title>

                    <FilterBase buttons={filterBaseButtons}
                                valueSearch={searchText}
                                onSearch={search.bind(this)}
                                showSearch
                    />

                    <BlockingElement fetching={fetching} className={classes.list}>
                        {filterQuestion && filterQuestion.length ?
                            filterQuestion.map((question: IQuestion) => {
                                return (
                                    <div key={question.id}
                                         className={classes.item}
                                         onClick={() => onClickHandler(question)}
                                    >{question.name}</div>
                                )
                            })
                            : <Empty message='Нет вопросов и ответов.'/>
                        }
                    </BlockingElement>
                </div>
            </Wrapper>
        </DefaultView>
    )
}

FaqPage.displayName = 'FaqPage'

export default React.memo(FaqPage)
