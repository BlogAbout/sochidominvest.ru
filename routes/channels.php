<?php

use App\WebSockets\SocketHandler\MessengerSocketHandler;
use BeyondCode\LaravelWebSockets\Facades\WebSocketsRouter;
use Illuminate\Support\Facades\Broadcast;

Broadcast::routes(['prefix' => 'api', 'middleware' => ['auth.api']]);

Broadcast::channel('users', function ($user) {
    return (int)$user->id;
});

WebSocketsRouter::webSocket('/socket/messenger', MessengerSocketHandler::class);
