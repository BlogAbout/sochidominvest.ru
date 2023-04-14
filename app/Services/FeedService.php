<?php

namespace App\Services;

use App\Http\Resources\FeedResource;
use App\Models\Feed;
use Exception;
use Illuminate\Support\Facades\DB;

class FeedService
{
    public function store(array $data)
    {
        try {
            DB::beginTransaction();

            $data['author_id'] = auth()->user()->id;

            if (isset($data['message_text'])) {
                $messageNew = $data['message_text'];
                unset($data['message_text']);
            }

            $feed = Feed::firstOrCreate($data);

            if (isset($messageNew)) {
                // Todo: создать сообщение
            }

            DB::commit();

            return (new FeedResource($feed))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }

    public function update(array $data, Feed $feed)
    {
        try {
            DB::beginTransaction();

            if (isset($data['message_text'])) {
                $messageNew = $data['message_text'];
                unset($data['message_text']);
            }

            $feed->update($data);

            if (isset($messageNew)) {
                // Todo: создать сообщение
            }

            DB::commit();

            return (new FeedResource($feed))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }
}
