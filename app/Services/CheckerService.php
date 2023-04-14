<?php

namespace App\Services;

use App\Http\Resources\CheckerResource;
use App\Models\Checker;
use Exception;
use Illuminate\Support\Facades\DB;

class CheckerService
{
    public function store(array $data)
    {
        try {
            DB::beginTransaction();

            $data['author_id'] = auth()->user()->id;

            $checker = Checker::firstOrCreate($data);

            DB::commit();

            return (new CheckerResource($checker))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }

    public function update(array $data, Checker $checker)
    {
        try {
            DB::beginTransaction();

            $checker->update($data);

            DB::commit();

            return (new CheckerResource($checker))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }
}
