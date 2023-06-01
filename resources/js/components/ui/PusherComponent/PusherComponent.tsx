import React, {useEffect} from 'react'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import {useActions} from '../../../hooks/useActions'

const PusherComponent: React.FC = (): null => {
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

        window.Echo
            .private('messenger.*')
            .listen('MessageEvent', (event: any) => {
                console.log('event', event)
            })
            .error((error: any) => {
                console.error('error', error)
            })
    }, [])

    return null
}

export default PusherComponent
