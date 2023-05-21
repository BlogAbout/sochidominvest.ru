<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Developer\StoreRequest;
use App\Http\Requests\Developer\UpdateRequest;
use App\Models\Developer;
use App\Services\DeveloperService;
use Illuminate\Http\Request;

class DeveloperController extends Controller
{
    public $service;

    public function __construct(DeveloperService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    public function show(Developer $developer)
    {
        return $this->service->show($developer);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, Developer $developer)
    {
        return $this->service->update($request, $developer);
    }

    public function destroy(Developer $developer)
    {
        return $this->service->destroy($developer);
    }
}
