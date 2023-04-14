<?php

namespace App\Services;

use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Exception;
use Illuminate\Support\Facades\DB;

class NotificationService
{
    public function store(array $data)
    {
        try {
            DB::beginTransaction();

            $data['author_id'] = auth()->user()->id;

            $notification = Notification::firstOrCreate($data);

            // Todo: заполнить список получателей

            DB::commit();

            return (new NotificationResource($notification))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }

    public function update(array $data, Notification $notification)
    {
        try {
            DB::beginTransaction();

            $notification->update($data);

            // Todo: заполнить список получателей

            DB::commit();

            return (new NotificationResource($notification))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }
}
