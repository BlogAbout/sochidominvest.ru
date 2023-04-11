<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Developer\StoreRequest;
use App\Http\Requests\Developer\UpdateRequest;
use App\Http\Resources\DeveloperResource;
use App\Models\Developer;
use Exception;

class DeveloperController extends Controller
{
    public function index()
    {
        $developers = Developer::all();

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
            $data['author_id'] = auth()->user()->id;

            $developer = Developer::create($data);

            return (new DeveloperResource($developer))->response()->setStatusCode(201);
        } catch (Exception $e) {
            return response($e->getMessage())->setStatusCode(400);
        }
    }

    public function update(UpdateRequest $request, Developer $developer)
    {
        try {
            $data = $request->validated();

            $developer->update($data);

            return (new DeveloperResource($developer))->response()->setStatusCode(200);
        } catch (Exception $e) {
            return response($e->getMessage())->setStatusCode(400);
        }
    }

    public function destroy(Developer $developer)
    {
        $developer->delete();

        return response([])->setStatusCode(200);
    }
}
