import React from 'react'
import PageMetaInfo from '../../ui/PageMetaInfo/PageMetaInfo'
import Navigation from '../../ui/Navigation/Navigation'
import ToolsPanel from '../../ui/ToolsPanel/ToolsPanel'
import classes from './PanelView.module.scss'

interface Props extends React.PropsWithChildren {
    pageTitle?: string
    pageDescription?: string
}

const defaultProps: Props = {}

const PanelView: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={classes.PanelView}>
            <PageMetaInfo title={props.pageTitle || ''} description={props.pageDescription || ''}/>

            <Navigation/>

            <main className={classes.main}>
                {props.children}
            </main>

            <ToolsPanel/>
        </div>
    )
}

PanelView.defaultProps = defaultProps
PanelView.displayName = 'PanelView'

export default React.memo(PanelView)
