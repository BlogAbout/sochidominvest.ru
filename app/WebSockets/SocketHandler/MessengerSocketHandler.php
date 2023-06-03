<?php

namespace App\WebSockets\SocketHandler;

use App\Models\Message;
use App\Services\MessageService;
use App\Services\UserService;
use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use Ratchet\WebSocket\MessageComponentInterface;

class MessengerSocketHandler extends BaseSocketHandler implements MessageComponentInterface
{
    private MessageService $messageService;

    public function __construct(UserService $userService, MessageService $messageService)
    {
        parent::__construct($userService);

        $this->messageService = $messageService;
    }

    /**
     * @throws \Exception
     */
    function onMessage(ConnectionInterface $from, MessageInterface $msg): void
    {
        $body = collect(json_decode($msg->getPayload(), true));

        $message = new Message;
        $message->fill($body->toArray());

        $type = $body->get('type');

        switch ($type) {
            case 'welcome':
            {
                $this->setConnectionInfo($from, $message->author_id);

                break;
            }
            case 'read':
            {
                // Todo: Обработка прочтения сообщений

                break;
            }
            case 'message': {
                $this->messageService->store($body->toArray());
                $this->sendMessage($from, $message);

                break;
            }
        }
    }

    /**
     * Отправка сообщений по списку подключений
     *
     * @param \Ratchet\ConnectionInterface $from Подключение, от кого отправлено
     * @param \App\Models\Message $message Объект отправляемого сообщения
     */
    private function sendMessage(ConnectionInterface $from, Message $message)
    {
//        $attendees = $message->getAttendees();
//        $sendAll = is_array($attendees) && count($attendees) > 0;
//
//        foreach ($this->clients as $client) {
//            if (!$sendAll && $from === $client) {
//                continue;
//            }
//
//            if ($sendAll || in_array($this->getConnectionUserId($client), $attendees)) {
//                $client->send($message->__toString());
//            }
//        }
    }
}
