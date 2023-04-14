<?php

namespace App\Http\Controllers\BusinessProcess;

use App\Http\Controllers\Controller;
use App\Http\Requests\BusinessProcess\StoreRequest;
use App\Http\Requests\BusinessProcess\UpdateRequest;
use App\Http\Resources\BusinessProcessResource;
use App\Models\BusinessProcess;
use App\Services\BusinessProcessService;

class BusinessProcessController extends Controller
{
    public $service;

    public function __construct(BusinessProcessService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $businessProcesses = BusinessProcess::all();

        return BusinessProcessResource::collection($businessProcesses)->response()->setStatusCode(200);
    }

    public function show(BusinessProcess $businessProcess)
    {
        return (new BusinessProcessResource($businessProcess))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();

        return $this->service->store($data);
    }

    public function update(UpdateRequest $request, BusinessProcess $businessProcess)
    {
        $data = $request->validated();

        return $this->service->update($data, $businessProcess);
    }

    public function destroy(BusinessProcess $businessProcess)
    {
        $businessProcess->delete();

        return response([])->setStatusCode(200);
    }
}
