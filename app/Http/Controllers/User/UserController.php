<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\AuthenticateRequest;
use App\Http\Requests\User\RegistrationRequest;
use App\Http\Requests\User\StoreRequest;
use App\Http\Requests\User\UpdateRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public $service;

    public function __construct(UserService $service)
    {
        $this->service = $service;
    }

    public function authenticate(AuthenticateRequest $request)
    {
        return $this->service->authenticate($request);
    }

    public function registration(RegistrationRequest $request)
    {
        return $this->service->registration($request);
    }

    public function logout(Request $request)
    {
        return $this->service->logout($request);
    }

    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    public function show(User $user)
    {
        return $this->service->show($user);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, User $user)
    {
        return $this->service->update($request, $user);
    }

    public function destroy(User $user)
    {
        return $this->service->destroy($user);
    }
}
