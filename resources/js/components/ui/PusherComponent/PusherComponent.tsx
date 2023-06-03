import React, {useEffect} from 'react'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import {useActions} from '../../../hooks/useActions'
import {IMessage} from '../../../@types/IMessenger'
import {useTypedSelector} from '../../../hooks/useTypedSelector'

const PusherComponent: React.FC = (): null => {
    const {user} = useTypedSelector(state => state.userReducer)

    const {joiningUsersOnline, leavingUserOnline} = useActions()

    useEffect(() => {
        window.Pusher = Pusher

        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: process.env.MIX_PUSHER_APP_KEY,
            cluster: process.env.MIX_PUSHER_APP_CLUSTER,
            forceTLS: false,
            wsHost: window.location.hostname,
            wsPort: process.env.MIX_WEBSOCKET_PORT || 80,
            wssPort: process.env.MIX_WEBSOCKET_PORT || 433,
            disableStats: true,
            enabledTransports: ['ws', 'wss']
        })

        window.Echo
            .join('users')
            .here((users: any) => {
                joiningUsersOnline(users)
            })
            .joining((user: any) => {
                joiningUsersOnline([user])
            })
            .leaving((user: any) => {
                leavingUserOnline(user)
            })
            .listen('MessageEvent', (event: any) => {
                console.log('event', event)
            })
            .error((error: any) => {
                console.error('error', error)
            })
    }, [])

    useEffect(() => {
        const webSocket = new WebSocket(`ws://${window.location.hostname}:6001/socket/messenger?appKey=${process.env.MIX_PUSHER_APP_KEY}`)

        webSocket.onopen = (event: Event) => {
            console.info('Успешное подключение к WebSocket', event)

            const message: IMessage = {
                id: null,
                messenger_id: null,
                is_active: 1,
                type: 'welcome',
                text: '',
                author_id: user.id,
                message_id: null,
                attendee_ids: []
            }

            webSocket.send(JSON.stringify(message))
        }

        webSocket.onmessage = (response: MessageEvent) => {
            console.log('onmessage', response)
        }

        window.WS = webSocket
    })

    const sendMessage = () => {

    }

    return null
}

export default PusherComponent
