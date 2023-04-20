import React, {useState} from 'react'
import Box from '../Box/Box'
import {IconProp} from '@fortawesome/fontawesome-svg-core'

interface Props extends React.PropsWithChildren {
    value?: string | number
    password?: boolean
    autoFocus?: boolean
    width?: string | number
    margin?: string | number
    flexGrow?: boolean
    placeHolder?: string
    title?: string
    readOnly?: boolean
    error?: boolean
    errorText?: string
    showValidate?: boolean
    showRequired?: boolean
    showClear?: boolean
    disableTitle?: boolean
    styleType?: 'standard' | 'minimal' | 'borderDisabled'
    icon?: IconProp

    onChange(value: string): void

    onBlur?(e: any): void
}

const defaultProps: Props = {
    value: '',
    password: false,
    styleType: 'standard',
    onChange(value: string): void {
        console.info('TextBox onChange', value)
    }
}

const TextBox: React.FC<Props> = ((props): React.ReactElement => {
    const [password, setPassword] = useState(props.password)

    const onChangeHandler = (e: any) => {
        props.onChange(e.target.value)
    }

    const onClearHandler = () => {
        props.onChange('')
    }

    const onClickPasswordEye = (): void => {
        setPassword(!password)
    }

    const onBlurHandler = (e: any) => {
        if (props.onBlur) {
            props.onBlur(e)
        } else {
            let value = e.target.value.trim()

            if (props.value !== value) {
                props.onChange(value)
            }
        }
    }

    return (
        <Box {...props}
             type='input'
             styleType={props.styleType}
             onChange={onChangeHandler.bind(this)}
             onClear={onClearHandler.bind(this)}
             onBlur={onBlurHandler.bind(this)}
             autoFocus={props.autoFocus}
             inputType={password ? 'password' : 'text'}
             eye={props.password ? !password : false}
             onPasswordEye={props.password ? onClickPasswordEye.bind(this) : undefined}
        />
    )
})

TextBox.defaultProps = defaultProps
TextBox.displayName = 'TextBox'

export default TextBox
