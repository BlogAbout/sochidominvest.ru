<?php

namespace App\Services;

use App\Http\Requests\Developer\StoreRequest;
use App\Http\Requests\Developer\UpdateRequest;
use App\Http\Resources\DeveloperResource;
use App\Models\Developer;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DeveloperService
{
    public function index(Request $request)
    {
        $filter = $request->all();

        $developers = Developer::query()
            ->when(isset($filter['id']), function ($query) use ($filter) {
                $query->whereIn('id', $filter['id']);
            })
            ->when(isset($filter['active']), function ($query) use ($filter) {
                $query->whereIn('is_active', $filter['active']);
            })
            ->when(isset($filter['text']), function ($query) use ($filter) {
                $query->where('name', 'like', '%' . $filter['text'] . '%');
            })
            ->limit($filter['limit'] ?? -1)
            ->get();

        return DeveloperResource::collection($developers)->response()->setStatusCode(200);
    }

    public function show(Developer $developer)
    {
        return (new DeveloperResource($developer))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();

            $developer = new Developer;
            $developer->fill(
                array_merge($data, [
                    'author_id' => Auth::user()->id
                ])
            )->save();

            return (new DeveloperResource($developer))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, Developer $developer)
    {
        try {
            $data = $request->validated();

            $developer->update($data);

            return (new DeveloperResource($developer))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Developer $developer)
    {
        $developer->delete();

        return response([])->setStatusCode(200);
    }
}
