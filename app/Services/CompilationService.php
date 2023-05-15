<?php

namespace App\Services;

use App\Http\Requests\Compilation\StoreRequest;
use App\Http\Requests\Compilation\UpdateRequest;
use App\Http\Resources\CompilationResource;
use App\Models\Compilation;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CompilationService
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

            DB::beginTransaction();

            $compilation = new Compilation;
            $compilation->fill(
                array_merge($data, [
                    'author_id' => Auth::user()->id
                ])
            )->save();

            isset($data['building_ids']) && $compilation->buildings()->attach($data['building_ids']);

            DB::commit();

            $compilation->refresh();

            return (new CompilationResource($compilation))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(400);
        }
    }

    public function update(UpdateRequest $request, Compilation $compilation)
    {
        try {
            $data = $request->validated();

            DB::beginTransaction();

            $compilation->update($data);

            isset($data['building_ids']) && $compilation->buildings()->sync($data['building_ids']);

            DB::commit();

            $compilation->refresh();

            return (new CompilationResource($compilation))->response()->setStatusCode(200);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(400);
        }
    }

    public function destroy(Compilation $compilation)
    {
        $compilation->delete();

        return response([])->setStatusCode(200);
    }
}
