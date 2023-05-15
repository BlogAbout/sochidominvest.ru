<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use App\Http\Requests\Notification\StoreRequest;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public $service;

    public function __construct(NotificationService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return $this->service->fetch();
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function readNotifications(Request $request)
    {
        return $this->service->updateNotificationForUser($request);
    }

    public function trashNotifications(Request $request)
    {
        return $this->service->updateNotificationForUser($request, 'trash');
    }
}
