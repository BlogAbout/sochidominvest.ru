import React, {useEffect, useMemo, useState} from 'react'
import {useParams} from 'react-router-dom'
import {converter} from '../../../helpers/utilHelper'
import {IProduct} from '../../../@types/IStore'
import StoreService from '../../../api/StoreService'
import Wrapper from '../../ui/Wrapper/Wrapper'
import DefaultView from '../../views/DefaultView/DefaultView'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Gallery from '../../../components/ui/Gallery/Gallery'
import Empty from '../../ui/Empty/Empty'
import ProductInfoBlock from './components/ProductInfoBlock/ProductInfoBlock'
import ProductAdvancedBlock from './components/ProductAdvancedBlock/ProductAdvancedBlock'
import Grid from '../../ui/Grid/Grid'
import GridColumn from '../../ui/Grid/components/GridColumn/GridColumn'
import Title from '../../ui/Title/Title'
import classes from './StoreProductPage.module.scss'

type StoreProductPageProps = {
    id: string
}

const ProductPage: React.FC = (): React.ReactElement => {
    const params = useParams<StoreProductPageProps>()

    const [fetchingProduct, setFetchingProduct] = useState(false)
    const [product, setProduct] = useState<IProduct>({} as IProduct)

    useEffect(() => {
        onFetchProduct()
    }, [params.id])

    const onFetchProduct = (): void => {
        if (params.id) {
            const productId = parseInt(params.id)

            setFetchingProduct(true)

            StoreService.fetchProductById(productId)
                .then((response: any) => setProduct(response.data.data))
                .catch((error: any) => console.error('Ошибка загрузки товара', error))
                .finally(() => setFetchingProduct(false))
        }
    }

    const pageTitle = useMemo(() => {
        return !product ? 'Товар' : !product.meta_title ? product.name : product.meta_title
    }, [product])

    const renderProductContent = (): React.ReactElement => {
        return (
            <BlockingElement fetching={fetchingProduct}
                             className={classes.block}
            >
                <Grid className={classes.headInfo}>
                    <GridColumn width='60%'>
                        <Gallery alt={product.name}
                                 images={product.images || []}
                                 videos={product.videos || []}
                                 type='carousel'
                                 fetching={fetchingProduct}
                                 avatar={product.avatar_id}
                                 className={classes.gallery}
                        />
                    </GridColumn>

                    <GridColumn width='40%'>
                        <ProductInfoBlock product={product}
                                          onSave={() => onFetchProduct()}
                        />
                    </GridColumn>
                </Grid>

                <Grid className={classes.info}>
                    <GridColumn>
                        {product.description && product.description.trim() !== '' ?
                            <div className={classes.description}>
                                <Title type='h2'>Описание</Title>

                                <div className={classes.text}
                                     dangerouslySetInnerHTML={{__html: converter.makeHtml(product.description)}}
                                />
                            </div>
                            : null
                        }

                        <ProductAdvancedBlock product={product}/>
                    </GridColumn>
                </Grid>
            </BlockingElement>
        )
    }

    return (
        <DefaultView pageTitle={pageTitle}>
            <Wrapper>
                <div className={classes.inner}>
                    <div className={classes.content}>
                        {product && product.id
                            ? renderProductContent()
                            : <Empty message='Товар не найден'/>
                        }
                    </div>
                </div>
            </Wrapper>
        </DefaultView>
    )
}

ProductPage.displayName = 'ProductPage'

export default React.memo(ProductPage)
