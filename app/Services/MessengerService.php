<?php

namespace App\Services;

use App\Http\Resources\MessengerResource;
use App\Models\Messenger;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MessengerService
{
    public function fetchList(array $filter = [])
    {
        $messengers = [];

        return MessengerResource::collection($messengers)->response()->setStatusCode(200);
    }

    /**
     * @throws \Exception
     */
    public function store(array $data): Messenger
    {
        try {
            DB::beginTransaction();

            $messenger = new Messenger;
            $messenger->fill([
                'name' => $data['name'] ?? '',
                'type' => $data['type'] ?? 'private',
                'author_id' => $data['author_id'] ?? Auth::user()->id,
                'avatar_id' => $data['avatar_id'] ?? null
            ])->save();

            isset($messenger['member_ids']) && $messenger->members->attach($messenger['member_ids']);

            DB::commit();

            $messenger->refresh();

            return $messenger;
        } catch (Exception $e) {
            DB::rollBack();

            throw $e;
        }
    }

    public function storeAndResponse(array $data)
    {
        try {
            $messenger = $this->store($data);

            return (new MessengerResource($messenger))->response()->setStatusCode(201);
        } catch (Exception $e) {
            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Messenger $messenger)
    {
        // Todo: Реализовать удаление у пользователя, который удаляет

        return response([])->setStatusCode(200);
    }
}
