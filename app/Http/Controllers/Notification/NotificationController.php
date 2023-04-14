<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use App\Http\Requests\Notification\StoreRequest;
use App\Http\Requests\Notification\UpdateRequest;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use App\Services\NotificationService;

class NotificationController extends Controller
{
    public $service;

    public function __construct(NotificationService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $notifications = Notification::all();

        return NotificationResource::collection($notifications)->response()->setStatusCode(200);
    }

    public function show(Notification $notification)
    {
        return (new NotificationResource($notification))->response()->setStatusCode(200);
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

    public function destroy(Notification $notification)
    {
        $notification->delete();

        return response([])->setStatusCode(200);
    }
}
