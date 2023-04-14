<?php

namespace App\Services;

use App\Http\Resources\BusinessProcessResource;
use App\Models\BusinessProcess;
use Exception;
use Illuminate\Support\Facades\DB;

class BusinessProcessService
{
    public function store(array $data)
    {
        try {
            DB::beginTransaction();

            $data['author_id'] = auth()->user()->id;

            $businessProcess = BusinessProcess::firstOrCreate($data);

            DB::commit();

            return (new BusinessProcessResource($businessProcess))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }

    public function update(array $data, BusinessProcess $businessProcess)
    {
        try {
            DB::beginTransaction();

            $businessProcess->update($data);

            DB::commit();

            return (new BusinessProcessResource($businessProcess))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }
}
