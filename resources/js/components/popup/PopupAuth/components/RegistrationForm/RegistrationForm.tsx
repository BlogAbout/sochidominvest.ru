import React, {useState} from 'react'
// @ts-ignore
import is from 'is_js'
import {useActions} from '../../../../../hooks/useActions'
import {ISignUp} from '../../../../../@types/IAuth'
import UserService from '../../../../../api/UserService'
import Title from '../../../../ui/Title/Title'
import TextBox from '../../../../form/TextBox/TextBox'
import Button from '../../../../form/Button/Button'
import Field from '../../../../form/Field/Field'
import classes from '../../PopupAuth.module.scss'

interface Props {
    onChangeType(type: string): void

    onClose(): void
}

const defaultProps: Props = {
    onChangeType: (type: string) => {
        console.info('RegistrationForm onChange', type)
    },
    onClose: () => {
        console.info('RegistrationForm onClose')
    }
}

const RegistrationForm: React.FC<Props> = (props): React.ReactElement => {
    const [signUp, setSignUp] = useState<ISignUp>({
        phone: '',
        email: '',
        password: '',
        name: '',
        role: 'subscriber'
    })

    const [validationError, setValidationError] = useState({
        phone: '',
        email: '',
        password: '',
        name: ''
    })

    const [info, setInfo] = useState({
        fetching: false,
        error: ''
    })

    const {setUserAuth} = useActions()

    const validationHandler = (): boolean => {
        let phoneError = ''
        let emailError = ''
        let passwordError = ''
        let nameError = ''

        if (signUp.phone === '') {
            phoneError = 'Введите номер телефона'
        }

        if (signUp.email === '') {
            emailError = 'Введите E-mail'
        } else if (!is.email(signUp.email)) {
            emailError = 'E-mail имеет неверный формат'
        }

        if (signUp.password === '') {
            passwordError = 'Введите пароль'
        }

        if (signUp.name === '') {
            nameError = 'Введите имя'
        }

        setValidationError({
            phone: phoneError,
            email: emailError,
            password: passwordError,
            name: nameError
        })

        return !(phoneError || emailError || passwordError || nameError)
    }

    const registrationHandler = async (event: React.MouseEvent<HTMLInputElement>) => {
        event.preventDefault()

        if (validationHandler()) {
            setInfo({
                fetching: true,
                error: ''
            })

            UserService.registrationUser(signUp)
                .then((response: any) => {
                    setUserAuth(response.data.data)

                    setInfo({
                        fetching: false,
                        error: ''
                    })

                    props.onClose()
                })
                .catch((error: any) => {
                    setInfo({
                        fetching: false,
                        error: error.data.data
                    })
                })
        }
    }

    return (
        <div className={classes.form}>
            <Title type='h2'>Регистрация</Title>

            <Field label='Имя'
                   title='Имя'
                   type='hor'
                   style='dark'
                   labelWidth={150}
            >
                <TextBox value={signUp.name}
                         placeHolder='Имя'
                         error={validationError.name !== ''}
                         errorText={validationError.name}
                         onChange={(value: string) => {
                             setSignUp({
                                 ...signUp,
                                 name: value
                             })

                             if (value.trim().length === 0) {
                                 setValidationError({...validationError, name: 'Введите имя'})
                             } else {
                                 setValidationError({...validationError, name: ''})
                             }
                         }}
                         styleType='minimal'
                         width='100%'
                />
            </Field>

            <Field label='E-mail'
                   title='E-mail'
                   type='hor'
                   style='dark'
                   labelWidth={150}
            >
                <TextBox value={signUp.email}
                         placeHolder='Email'
                         error={validationError.email !== ''}
                         errorText={validationError.email}
                         onChange={(value: string) => {
                             setSignUp({
                                 ...signUp,
                                 email: value
                             })

                             if (value.trim().length === 0) {
                                 setValidationError({...validationError, email: 'Введите имя'})
                             } else if (!is.email(value)) {
                                 setValidationError({...validationError, email: 'E-mail имеет неверный формат'})
                             } else {
                                 setValidationError({...validationError, email: ''})
                             }
                         }}
                         styleType='minimal'
                         width='100%'
                />
            </Field>

            <Field label='Телефон'
                   title='Телефон'
                   type='hor'
                   style='dark'
                   labelWidth={150}
            >
                <TextBox value={signUp.phone}
                         placeHolder='Телефон'
                         error={validationError.phone !== ''}
                         errorText={validationError.phone}
                         onChange={(value: string) => {
                             setSignUp({
                                 ...signUp,
                                 phone: value
                             })

                             if (value.trim().length === 0) {
                                 setValidationError({...validationError, phone: 'Введите номер телефона'})
                             } else {
                                 setValidationError({...validationError, phone: ''})
                             }
                         }}
                         styleType='minimal'
                         width='100%'
                />
            </Field>

            <Field label='Пароль'
                   title='Пароль'
                   type='hor'
                   style='dark'
                   labelWidth={150}
            >
                <TextBox password={true}
                         value={signUp.password}
                         placeHolder='Пароль'
                         error={validationError.password !== ''}
                         errorText={validationError.password}
                         onChange={(value: string) => {
                             setSignUp({
                                 ...signUp,
                                 password: value
                             })

                             if (value.length > 0 && value.length < 6) {
                                 setValidationError({
                                     ...validationError,
                                     password: 'Минимальная длина пароля 6 символов'
                                 })
                             } else if (value.length === 0) {
                                 setValidationError({...validationError, password: 'Введите пароль'})
                             } else {
                                 setValidationError({...validationError, password: ''})
                             }
                         }}
                         styleType='minimal'
                         width='100%'
                />
            </Field>

            {info.error !== '' && <div className={classes.errorMessage}>{info.error}</div>}

            <div className={classes.buttons}>
                <Button type='apply'
                        disabled={info.fetching || validationError.name !== '' || validationError.email !== '' || validationError.phone !== '' || validationError.password !== ''}
                        onClick={registrationHandler.bind(this)}
                >Создать аккаунт</Button>

                <div className={classes.links}>
                    <strong onClick={() => props.onChangeType('login')}>Войти</strong>
                    <span>или</span>
                    <strong onClick={() => props.onChangeType('forgot')}>Восстановить пароль</strong>
                </div>
            </div>
        </div>
    )
}

RegistrationForm.defaultProps = defaultProps
RegistrationForm.displayName = 'RegistrationForm'

export default React.memo(RegistrationForm)
