<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreRequest;
use App\Http\Requests\User\UpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;

class UserController extends Controller
{
    public $service;

    public function __construct(UserService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $users = User::all();

        return UserResource::collection($users)->response()->setStatusCode(200);
    }

    public function show(User $user)
    {
        return (new UserResource($user))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();

        return $this->service->store($data);
    }

    public function update(UpdateRequest $request, User $user)
    {
        $data = $request->validated();

        return $this->service->update($data, $user);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response([])->setStatusCode(200);
    }
}
