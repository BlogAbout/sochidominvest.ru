import React, {useEffect, useMemo, useState} from 'react'
import {IFilterContent} from '../../../@types/IFilter'
import {IPost} from '../../../@types/IPost'
import {compareText} from '../../../helpers/filterHelper'
import {postTypes} from '../../../helpers/postHelper'
import {checkRules, Rules} from '../../../helpers/accessHelper'
import PostService from '../../../api/PostService'
import Title from '../../ui/Title/Title'
import Wrapper from '../../ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import PostList from './components/PostList/PostList'
import openPopupPostCreate from '../../../components/popup/PopupPostCreate/PopupPostCreate'
import classes from './PostsPage.module.scss'

const PostsPage: React.FC = (): React.ReactElement => {
    const [fetching, setFetching] = useState(false)
    const [posts, setPosts] = useState<IPost[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterPost, setFilterPost] = useState<IPost[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState({
        types: ['main', 'common']
    })

    useEffect(() => {
        fetchPostsHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [posts, filters])

    const fetchPostsHandler = (): void => {
        setFetching(true)

        PostService.fetchPosts({active: [0, 1]})
            .then((response: any) => setPosts(response.data.data))
            .catch((error: any) => console.error('Произошла ошибка загрузки данных', error))
            .finally(() => setFetching(false))
    }

    // Рекурсия для древовидного списка
    const recursiveThree = (sortingArray: IPost[], parentId: number | null, items: IPost[], level: number): IPost[] => {
        for (const item of sortingArray) {
            if (item.post_id == null) {
                item.post_id = 0
            }

            if (item.post_id == parentId) {
                item.spaces = level
                items.push(item)
                recursiveThree(sortingArray, item.id, items, level + 1)
            }
        }

        return items
    }

    // Построение древовидного списка
    const sortingTreePosts = (): IPost[] => {
        const items: IPost[] = []
        recursiveThree(JSON.parse(JSON.stringify(posts)), 0, items, 0)

        return items
    }

    const onSaveHandler = (): void => {
        fetchPostsHandler()
    }

    const search = (value: string): void => {
        setSearchText(value)

        if (!posts || !posts.length) {
            setFilterPost([])
        }

        if (value !== '') {
            setFilterPost(filterItemsHandler(posts.filter((post: IPost) => {
                return compareText(post.name, value) || compareText(post.description, value)
            })))
        } else {
            setFilterPost(filterItemsHandler(sortingTreePosts()))
        }
    }

    const onAddHandler = (): void => {
        openPopupPostCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    const filterItemsHandler = (list: IPost[]): IPost[] => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IPost) => {
            return filters.types.includes(item.type)
        })
    }

    const filtersContent: IFilterContent[] = useMemo((): IFilterContent[] => {
        return [
            {
                title: 'Тип',
                type: 'checker',
                multi: true,
                items: postTypes,
                selected: filters.types,
                onSelect: (values: string[]) => {
                    setFilters({...filters, types: values})
                }
            }
        ]
    }, [filters])

    return (
        <PanelView pageTitle='Должности'>
            <SidebarLeft filters={filtersContent}
                         isShow={isShowFilter}
                         onChangeShow={(isShow: boolean) => setIsShowFilter(isShow)}
            />

            <Wrapper isFull>
                <Title type='h1'
                       onAdd={checkRules([Rules.ADD_POST]) ? onAddHandler.bind(this) : undefined}
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                >Должности</Title>

                <PostList list={filterPost} fetching={fetching} onSave={() => fetchPostsHandler()}/>
            </Wrapper>
        </PanelView>
    )
}

PostsPage.displayName = 'PostsPage'

export default React.memo(PostsPage)
