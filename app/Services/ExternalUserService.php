<?php

namespace App\Services;

use App\Http\Requests\ExternalUser\StoreRequest;
use App\Http\Requests\ExternalUser\UpdateRequest;
use App\Http\Resources\ExternalUserResource;
use App\Models\ExternalUser;
use Exception;

class ExternalUserService
{
    public function index()
    {
        $externalUsers = ExternalUser::all();

        return ExternalUserResource::collection($externalUsers)->response()->setStatusCode(200);
    }

    public function show(ExternalUser $externalUser)
    {
        return (new ExternalUserResource($externalUser))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();

            $externalUser = new ExternalUser;
            $externalUser->fill($data)->save();

            return (new ExternalUserResource($externalUser))->response()->setStatusCode(201);
        } catch (Exception $e) {
            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, ExternalUser $externalUser)
    {
        try {
            $data = $request->validated();

            $externalUser->update($data);

            return (new ExternalUserResource($externalUser))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(ExternalUser $externalUser)
    {
        $externalUser->delete();

        return response([])->setStatusCode(200);
    }
}
