<?php

namespace App\WebSockets\SocketHandler;

use App\Services\UserService;
use BeyondCode\LaravelWebSockets\Apps\App;
use BeyondCode\LaravelWebSockets\QueryParameters;
use BeyondCode\LaravelWebSockets\WebSockets\Exceptions\UnknownAppKey;
use Ratchet\ConnectionInterface;
use Ratchet\WebSocket\MessageComponentInterface;

abstract class BaseSocketHandler implements MessageComponentInterface
{
    protected UserService $userService;
    protected \SplObjectStorage $clients;
    protected array $clientsInfo;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
        $this->clients = new \SplObjectStorage;
        $this->clientsInfo = [];
    }

    /**
     * При открытии соединения проверяем ключ, генерируем идентификатор сокета и добавляем соединение в массив
     *
     * @param \Ratchet\ConnectionInterface $conn
     * @throws \BeyondCode\LaravelWebSockets\WebSockets\Exceptions\UnknownAppKey
     */
    function onOpen(ConnectionInterface $conn): void
    {
        $this->verifyAppKey($conn)->generateSocketId($conn);

        $this->clients->attach($conn);
        $this->clientsInfo[$conn->resourceId] = null;
    }

    /**
     * При отключении удаляем соединение из массива и обновляем дату последнего посещения пользователя
     *
     * @param \Ratchet\ConnectionInterface $conn
     */
    function onClose(ConnectionInterface $conn): void
    {
        $this->clients->detach($conn);

        if (!empty($this->getConnectionUserId($conn))) {
            $this->userService->updateLastActivity($this->getConnectionUserId($conn));

            unset($this->clientsInfo[$conn->resourceId]);
        }
    }

    /**
     * При возникновении любой ошибки просто закроем соединение
     *
     * @param \Ratchet\ConnectionInterface $conn
     * @param \Exception $e
     */
    function onError(ConnectionInterface $conn, \Exception $e): void
    {
        $conn->close();
    }

    /**
     * Установка дополнительной информации для подключения
     *
     * @param \Ratchet\ConnectionInterface $connection
     * @param int $userId Идентификатор пользователя
     */
    protected function setConnectionInfo(ConnectionInterface $connection, int $userId): void
    {
        $this->clientsInfo[$connection->resourceId] = $userId;
    }

    /**
     * Получение идентификатора пользователя выбранного подключения
     *
     * @param $connection
     * @return int
     */
    protected function getConnectionUserId($connection): int
    {
        return $this->clientsInfo[$connection->resourceId];
    }

    /**
     * Верификация ключа приложения для запрета доступа извне
     *
     * @param \Ratchet\ConnectionInterface $connection
     * @return $this
     * @throws \BeyondCode\LaravelWebSockets\WebSockets\Exceptions\UnknownAppKey
     */
    protected function verifyAppKey(ConnectionInterface $connection): BaseSocketHandler
    {
        $appKey = QueryParameters::create($connection->httpRequest)->get('appKey');

        if (!$app = App::findByKey($appKey)) {
            throw new UnknownAppKey($appKey);
        }

        $connection->app = $app;

        return $this;
    }

    /**
     * Генерация идентификатора сокета
     *
     * @param \Ratchet\ConnectionInterface $connection
     * @return $this
     * @throws \Exception
     */
    protected function generateSocketId(ConnectionInterface $connection): BaseSocketHandler
    {
        $socketId = sprintf('%d.%d', random_int(1, 1000000000), random_int(1, 1000000000));

        $connection->socketId = $socketId;

        return $this;
    }
}
