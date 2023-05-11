<?php

namespace App\Services;

use App\Http\Resources\UserResource;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function registration(array $data)
    {
        $data['password'] = Hash::make($data['password']);

        return User::firstOrCreate($data);
    }

    public function store(array $data)
    {
        try {
            DB::beginTransaction();

            $data['password'] = Hash::make($data['password']);

            $user = User::firstOrCreate($data);

            DB::commit();

            return (new UserResource($user))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }

    public function update(array $data, User $user)
    {
        try {
            DB::beginTransaction();

            if (isset($data['favorite_ids'])) {
                $favoriteIds = $data['favorite_ids'];
                unset($data['favorite_ids']);
            }

            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }

            if (isset($data['business_process_sorting'])) {
                $bpSorting = $data['business_process_sorting'];
                unset($data['business_process_sorting']);
            }

            $user->update($data);

            if (isset($favoriteIds)) {
                $user->favorites()->sync($favoriteIds);
            }

            if (isset($bpSorting)) {
                DB::table('sdi_business_process_sorting')
                    ->updateOrInsert(
                        ['user_id' => $user->id],
                        ['sorting' => json_encode($bpSorting)]
                    );
            }

            DB::commit();

            $user->refresh();

            return (new UserResource($user))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }
}
