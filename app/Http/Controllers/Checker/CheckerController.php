<?php

namespace App\Http\Controllers\Checker;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checker\StoreRequest;
use App\Http\Requests\Checker\UpdateRequest;
use App\Models\Checker;
use App\Services\CheckerService;
use Illuminate\Http\Request;

class CheckerController extends Controller
{
    public $service;

    public function __construct(CheckerService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, Checker $checker)
    {
        return $this->service->update($request, $checker);
    }

    public function destroy(Checker $checker)
    {
        return $this->service->destroy($checker);
    }
}
