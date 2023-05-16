<?php

namespace App\Http\Controllers\BusinessProcess;

use App\Http\Controllers\Controller;
use App\Http\Requests\BusinessProcess\StoreRequest;
use App\Http\Requests\BusinessProcess\UpdateRequest;
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
        return $this->service->index();
    }

    public function show(BusinessProcess $businessProcess)
    {
        return $this->show($businessProcess);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, BusinessProcess $businessProcess)
    {
        return $this->service->update($request, $businessProcess);
    }

    public function destroy(BusinessProcess $businessProcess)
    {
        return $this->service->destroy($businessProcess);
    }
}
