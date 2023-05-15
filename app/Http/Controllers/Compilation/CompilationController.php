<?php

namespace App\Http\Controllers\Compilation;

use App\Http\Controllers\Controller;
use App\Http\Requests\Compilation\StoreRequest;
use App\Http\Requests\Compilation\UpdateRequest;
use App\Models\Compilation;
use App\Services\CompilationService;

class CompilationController extends Controller
{
    public $service;

    public function __construct(CompilationService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return $this->service->index();
    }

    public function show(Compilation $compilation)
    {
        return $this->service->show($compilation);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, Compilation $compilation)
    {
        return $this->service->update($request, $compilation);
    }

    public function destroy(Compilation $compilation)
    {
        return $this->service->destroy($compilation);
    }
}
