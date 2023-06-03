<?php

namespace App\Services;

use App\Http\Resources\MessageResource;
use App\Models\Message;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MessageService
{
    private $messengerService;

    public function __construct(MessengerService $messengerService)
    {
        $this->messengerService = $messengerService;
    }

    public function fetchList(array $filter)
    {
        $messages = Message::query()
            ->when(isset($filter['id']), function ($query) use ($filter) {
                $query->whereIn('id', $filter['id']);
            })
            ->when(isset($filter['messengerId']), function ($query) use ($filter) {
                $query->whereIn('messenger_id', $filter['messengerId']);
            })
            ->when(isset($filter['active']), function ($query) use ($filter) {
                $query->whereIn('is_active', $filter['active']);
            })
            ->when(isset($filter['author']), function ($query) use ($filter) {
                $query->whereIn('author_id', $filter['author']);
            })
            ->when(isset($filter['type']), function ($query) use ($filter) {
                $query->where('type', '=', $filter['type']);
            })
            ->limit($filter['limit'] ?? -1)
            ->get();

        return MessageResource::collection($messages)->response()->setStatusCode(200);
    }

    /**
     * @throws \Exception
     */
    public function store(array $data): Message
    {
        try {
            DB::beginTransaction();

            $authorId = Auth::user()->id;

            if (!isset($data['messenger_id'])) {
                $messengerData = [
                    'author_id' => $authorId,
                    'member_ids' => $data['attendee_ids'],
                    'type' => 'private'
                ];

                $messenger = $this->messengerService->store($messengerData);

                $data['messenger_id'] = $messenger->id;
            }

            $data['author_id'] = $authorId;

            $message = new Message;
            $message->fill($data)->save();

            DB::commit();

            $message->refresh();

            return $message;
        } catch (Exception $e) {
            DB::rollBack();

            throw $e;
        }
    }

    public function storeAndResponse(array $data)
    {
        try {
            $message = $this->store($data);

            return (new MessageResource($message))->response()->setStatusCode(201);
        } catch (Exception $e) {
            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(array $data)
    {
        // Todo: Реализовать изменение сообщения с последующим уведомлением

        return response([])->setStatusCode(200);
    }

    public function destroy(Message $message)
    {
        // Todo: Реализовать удаление у пользователя, который удаляет

        return response([])->setStatusCode(200);
    }
}
