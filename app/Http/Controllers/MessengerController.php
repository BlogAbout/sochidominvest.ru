<?php

namespace App\Http\Controllers;

use App\Http\Requests\Message\StoreRequest;
use App\Http\Requests\Message\UpdateRequest;
use App\Models\Message;
use App\Models\Messenger;
use App\Services\MessageService;
use App\Services\MessengerService;
use Illuminate\Support\Facades\Request;

class MessengerController extends Controller
{
    private $messengerService;
    private $messageService;

    public function __construct(MessengerService $messengerService, MessageService $messageService)
    {
        $this->messengerService = $messengerService;
        $this->messageService = $messageService;
    }

    public function fetchMessengers(Request $request)
    {
        $filter = $request->all();

        return $this->messengerService->fetchList($filter);
    }

    public function removeMessenger(Messenger $messenger)
    {
        return $this->messengerService->destroy($messenger);
    }

    public function fetchMessages(int $messengerId)
    {
        $filter = [
            'messengerId' => [$messengerId]
        ];

        return $this->messageService->fetchList($filter);
    }

    public function sendMessage(StoreRequest $request)
    {
        $data = $request->validated();

        return $this->messageService->storeAndResponse($data);
    }

    public function editMessage(UpdateRequest $request)
    {
        $data = $request->validated();

        return $this->messageService->update($data);
    }

    public function removeMessage(Message $message)
    {
        return $this->messageService->destroy($message);
    }
}
