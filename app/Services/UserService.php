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

            if (auth()->check()) {
                $data['author_id'] = auth()->user()->id;
            }

            $data['password'] = Hash::make($data['password']);

            if (isset($data['building_ids'])) {
                $buildingIds = $data['building_ids'];
                unset($data['building_ids']);
            }

            if (isset($data['image_ids'])) {
                $imageIds = $data['image_ids'];
                unset($data['image_ids']);
            }

            $user = User::firstOrCreate($data);

            if (isset($buildingIds)) {
                $user->buildings()->attach($buildingIds);
            }

            if (isset($buildingIds)) {
                $user->images()->attach($imageIds);
            }

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

            if (isset($data['building_ids'])) {
                $buildingIds = $data['building_ids'];
                unset($data['building_ids']);
            }

            if (isset($data['image_ids'])) {
                $imageIds = $data['image_ids'];
                unset($data['image_ids']);
            }

            if (isset($data['favorite_ids'])) {
                $favoriteIds = $data['favorite_ids'];
                unset($data['favorite_ids']);
            }

            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }

            $user->update($data);

            if (isset($buildingIds)) {
                $user->buildings()->sync($buildingIds);
            }

            if (isset($buildingIds)) {
                $user->images()->sync($imageIds);
            }

            if (isset($favoriteIds)) {
                $user->favorites()->sync($favoriteIds);
            }

            DB::commit();

            return (new UserResource($user))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }
}
