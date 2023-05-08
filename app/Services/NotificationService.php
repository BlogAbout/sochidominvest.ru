<?php

namespace App\Services;

use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NotificationService
{
    public function fetch()
    {
        $notifications = Notification::select('sdi_notifications.*', 'sdi_notification_users.status')
            ->join('sdi_notification_users', 'sdi_notifications.id', '=', 'sdi_notification_users.notification_id')
            ->where('sdi_notification_users.user_id', '=', auth()->user()->id)
            ->where('sdi_notification_users.status', '!=', 'trash')
            ->get();

        return NotificationResource::collection($notifications)->response()->setStatusCode(200);
    }

    public function store(array $data)
    {
        try {
            DB::beginTransaction();

            if (auth()->check()) {
                $data['author_id'] = auth()->user()->id;
            }

            $userIds = [];
            if (isset($data['user_ids'])) {
                $userIds = $data['user_ids'];
                unset($data['user_ids']);
            }

            $notification = Notification::firstOrCreate($data);

            $this->setNotificationForUsers($notification, $userIds);

            DB::commit();

            return (new NotificationResource($notification))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }

    public function updateNotificationForUser(array $filter, $type = 'read')
    {
        DB::table('sdi_notification_users')
            ->where('user_id', auth()->user()->id)
            ->when(isset($filter['id']), function ($query) use ($filter) {
                $query->whereIn('notification_id', $filter['id']);
            })
            ->when($type === 'read', function ($query) {
                $query->where('status', 'new')->update(['status' => 'read']);
            })
            ->when($type === 'trash', function ($query) {
                $query->where('status', '!=', 'trash')->update(['status' => 'trash']);
            });

        return $this->fetch();
    }

    private function setNotificationForUsers(Notification $notification, array $userIds = [])
    {
        $attendees = $this->getAttendees($notification, $userIds);

        if (count($attendees)) {
            $notification->users()->attach($attendees);
        }
    }

    /**
     * @param \App\Models\Notification $notification Объект уведомления
     * @param array $userIds Массив идентификаторов пользователей (получателей)
     * @return array Итоговый массив идентификаторов пользователей (получателей)
     */
    private function getAttendees(Notification $notification, array $userIds = []): array
    {
        $userIds = collect($userIds);

        switch ($notification->type) {
            case 'system':
                $userIds = DB::table('sdi_users')
                    ->select('id')
                    ->pluck('id');
                break;
            case 'booking':
            case 'feed':
                if (!$userIds->count()) {
                    $userIds = DB::table('sdi_users')
                        ->select('id')
                        ->whereIn('role_id', [2, 3, 4])
                        ->pluck('id');
                }
                break;
            case 'add':
            case 'update':
            default:
                // Todo
                break;
        }

        return $userIds->values()->all();
    }
}
