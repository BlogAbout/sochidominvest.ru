<?php

namespace App\Services;

use App\Http\Requests\User\AuthenticateRequest;
use App\Http\Requests\User\RegistrationRequest;
use App\Http\Requests\User\StoreRequest;
use App\Http\Requests\User\UpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function registration(RegistrationRequest $request)
    {
        $data = $request->validated();

        $user = new User;
        $user->fill(
            array_merge($data, [
                'password' => Hash::make($data['password'])
            ])
        )->save();

        if ($user) {
            $credentials = [
                'email' => $data['email'],
                'password' => $data['password'],
                'is_active' => 1,
                'is_block' => 0
            ];

            if (Auth::attempt($credentials)) {
                $request->session()->regenerate();

                return (new UserResource(Auth::user()))->response()->setStatusCode(200);
            } else {
                return response(['message' => 'Ошибка авторизации. Неверный E-mail или пароль.'])->setStatusCode(401);
            }
        }

        return response(['message' => 'Ошибка регистрации. Пользователь с таким E-mail уже существует.'])->setStatusCode(500);
    }

    public function authenticate(AuthenticateRequest $request)
    {
        $data = $request->validated();

        $credentials = [
            'email' => $data['email'],
            'password' => $data['password'],
            'is_active' => 1,
            'is_block' => 0
        ];

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return (new UserResource(Auth::user()))->response()->setStatusCode(200);
        }

        return response(['message' => 'Ошибка авторизации. Неверный E-mail или пароль.'])->setStatusCode(422);
    }

    public function logout(Request $request)
    {
        Auth::user()->update(['last_active' => now()]);

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
        try {
            $data = $request->validated();

            DB::beginTransaction();

            $user = new User;
            $user->fill(
                array_merge($data, [
                    'password' => Hash::make($data['password'])
                ])
            )->save();

            DB::commit();

            $user->refresh();

            return (new UserResource($user))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, User $user)
    {
        try {
            $data = $request->validated();

            DB::beginTransaction();

            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }

            $user->update($data);

            if (isset($data['favorite_ids'])) {
                $user->favorites()->sync($data['favorite_ids']);
            }

            if (isset($data['business_process_sorting'])) {
                DB::table('sdi_business_process_sorting')
                    ->updateOrInsert(
                        ['user_id' => $user->id],
                        ['sorting' => json_encode($data['business_process_sorting'])]
                    );
            }

            DB::commit();

            $user->refresh();

            return (new UserResource($user))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response([])->setStatusCode(200);
    }
}
