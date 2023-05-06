<?php

namespace App\Http\Controllers\Compilation;

use App\Http\Controllers\Controller;
use App\Http\Requests\Compilation\StoreRequest;
use App\Http\Requests\Compilation\UpdateRequest;
use App\Http\Resources\CompilationResource;
use App\Models\Compilation;
use Exception;

class CompilationController extends Controller
{
    public function index()
    {
        $compilations = Compilation::all();

        return CompilationResource::collection($compilations)->response()->setStatusCode(200);
    }

    public function show(Compilation $compilation)
    {
        return (new CompilationResource($compilation))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();
            $data['author_id'] = auth()->user()->id;

            $compilation = Compilation::create($data);

            return (new CompilationResource($compilation))->response()->setStatusCode(201);
        } catch (Exception $e) {
            return response($e->getMessage())->setStatusCode(400);
        }
    }

    public function update(UpdateRequest $request, Compilation $compilation)
    {
        try {
            $data = $request->validated();

            if (isset($data['building_ids'])) {
                $buildingIds = $data['building_ids'];
                unset($data['building_ids']);
            }

            $compilation->update($data);

            if (isset($buildingIds)) {
                $compilation->buildings()->sync($buildingIds);
            }

            $compilation->refresh();

            return (new CompilationResource($compilation))->response()->setStatusCode(200);
        } catch (Exception $e) {
            return response($e->getMessage())->setStatusCode(400);
        }
    }

    public function destroy(Compilation $compilation)
    {
        $compilation->delete();

        return response([])->setStatusCode(200);
    }
}
