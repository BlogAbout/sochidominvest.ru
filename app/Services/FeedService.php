<?php

namespace App\Services;

use App\Http\Requests\Feed\StoreRequest;
use App\Http\Requests\Feed\UpdateRequest;
use App\Http\Resources\FeedResource;
use App\Models\Feed;
use App\Models\FeedMessage;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FeedService
{
    public function index()
    {
        $feeds = Feed::all();

        return FeedResource::collection($feeds)->response()->setStatusCode(200);
    }

    public function show(Feed $feed)
    {
        return (new FeedResource($feed))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();

            if (Auth::check()) {
                $data['author_id'] = Auth::user()->id;
            }

            DB::beginTransaction();

            $feed = new Feed;
            $feed->fill($data)->save();

            if (isset($data['message_text'])) {
                $feedMessage = new FeedMessage;
                $feedMessage->fill([
                    'feed_id' => $feed->id,
                    'author_id' => Auth::user()->id,
                    'status' => 'new',
                    'content' => $data['message_text'],
                    'is_active' => true
                ])->save();
            }

            DB::commit();

            $feed->refresh();

            return (new FeedResource($feed))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, Feed $feed)
    {
        try {
            $data = $request->validated();

            DB::beginTransaction();

            $feed->update($data);

            if (isset($data['message_text'])) {
                $feedMessage = new FeedMessage;
                $feedMessage->fill([
                    'feed_id' => $feed->id,
                    'author_id' => Auth::user()->id,
                    'status' => 'new',
                    'content' => $data['message_text'],
                    'is_active' => true
                ])->save();
            }

            DB::commit();

            $feed->refresh();

            return (new FeedResource($feed))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Feed $feed)
    {
        $feed->delete();

        return response([])->setStatusCode(200);
    }
}
