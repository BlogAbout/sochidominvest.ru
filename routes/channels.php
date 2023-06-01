<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::routes(['prefix' => 'api', 'middleware' => ['auth.api']]);

Broadcast::channel('users', function ($user) {
    return (int)$user->id;
});
