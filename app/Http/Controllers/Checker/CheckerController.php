<?php

namespace App\Http\Controllers\Checker;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checker\StoreRequest;
use App\Http\Requests\Checker\UpdateRequest;
use App\Http\Resources\CheckerResource;
use App\Models\Checker;
use App\Services\CheckerService;

class CheckerController extends Controller
{
    public $service;

    public function __construct(CheckerService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $checkers = Checker::all();

        return CheckerResource::collection($checkers)->response()->setStatusCode(200);
    }

    public function show(Checker $checker)
    {
        return (new CheckerResource($checker))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();

        return $this->service->store($data);
    }

    public function update(UpdateRequest $request, Checker $checker)
    {
        $data = $request->validated();

        return $this->service->update($data, $checker);
    }

    public function destroy(Checker $checker)
    {
        $checker->delete();

        return response([])->setStatusCode(200);
    }
}
