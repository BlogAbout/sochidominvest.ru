<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use App\Http\Requests\Notification\StoreRequest;
use App\Http\Requests\Notification\UpdateRequest;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        $data = $request->validated();

        return $this->service->store($data);
    }

    public function update(UpdateRequest $request, Notification $notification)
    {
        $data = $request->validated();

        return $this->service->update($data, $notification);
    }

    public function readNotifications(Request $request)
    {
        $filter = $request->all();

        return $this->service->updateNotificationForUser($filter);
    }

    public function trashNotifications(Request $request)
    {
        $filter = $request->all();

        return $this->service->updateNotificationForUser($filter, 'trash');
    }
}
