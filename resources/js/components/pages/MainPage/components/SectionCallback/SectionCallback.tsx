import React from 'react'
import Wrapper from '../../../../ui/Wrapper/Wrapper'
import Title from '../../../../ui/Title/Title'
import Button from '../../../../form/Button/Button'
import openPopupFeedCreate from '../../../../popup/PopupFeedCreate/PopupFeedCreate'
import classes from './SectionCallback.module.scss'

const SectionCallback: React.FC = (): React.ReactElement => {
    const showCallbackFormHandler = (): void => {
        openPopupFeedCreate(document.body, {
            type: 'callback'
        })
    }

    return (
        <section className={classes.SectionCallback}>
            <Wrapper>
                <div className={classes.inner}>
                    <Title type='h2'
                           style='center'
                           className={classes.title}
                    >Готовы к созданию собственной истории успеха в сфере недвижимости?</Title>

                    <p>
                        Независимо от того, заинтересованы ли вы в том, сколько стоит ваша недвижимость сегодня,
                        рассматриваете варианты работ или задаетесь вопросом, что купить, наша дружная команда будет
                        рада поболтать без обязательств.
                    </p>

                    <div className={classes.buttons}>
                        <Button type='apply'
                                onClick={() => showCallbackFormHandler()}
                                title='Оставить заявку'
                        >Оставить заявку</Button>
                    </div>
                </div>
            </Wrapper>
        </section>
    )
}

SectionCallback.displayName = 'SectionCallback'

export default React.memo(SectionCallback)
