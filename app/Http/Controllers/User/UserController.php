<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\AuthenticateRequest;
use App\Http\Requests\User\RegistrationRequest;
use App\Http\Requests\User\StoreRequest;
use App\Http\Requests\User\UpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public $service;

    public function __construct(UserService $service)
    {
        $this->service = $service;
    }

    public function authenticate(AuthenticateRequest $request)
    {
        $credentials = $request->validated();
        $credentials['is_active'] = 1;
        $credentials['is_block'] = 0;

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return (new UserResource(Auth::user()))->response()->setStatusCode(200);
        }

        return response(['message' => 'Ошибка авторизации. Неверный E-mail или пароль.'])->setStatusCode(422);
    }

    public function registration(RegistrationRequest $request)
    {
        $data = $request->validated();

        $credentials = [
            'email' => $data['email'],
            'password' => $data['password'],
            'is_active' => 1,
            'is_block' => 0
        ];

        $user = $this->service->store($data);

        if ($user) {
            if (Auth::attempt($credentials)) {
                $request->session()->regenerate();

                return (new UserResource(Auth::user()))->response()->setStatusCode(200);
            } else {
                return response(['message' => 'Ошибка авторизации. Неверный E-mail или пароль.'])->setStatusCode(401);
            }
        }

        return response(['message' => 'Ошибка регистрации. Пользователь с таким E-mail уже существует.'])->setStatusCode(500);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response([])->setStatusCode(200);
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
