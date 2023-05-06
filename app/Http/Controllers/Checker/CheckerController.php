<?php

namespace App\Http\Controllers\Checker;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checker\StoreRequest;
use App\Http\Requests\Checker\UpdateRequest;
use App\Http\Resources\CheckerResource;
use App\Models\Building;
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
        $filter = $request->all();

        $checkers = Checker::query()
            ->when(isset($filter['id']), function ($query) use ($filter) {
                $query->whereIn('id', $filter['id']);
            })
            ->when(isset($filter['buildingId']), function ($query) use ($filter) {
                $query->whereIn('building_id', $filter['buildingId']);
            })
            ->when(isset($filter['active']), function ($query) use ($filter) {
                $query->whereIn('is_active', $filter['active']);
            })
            ->when(isset($filter['author']), function ($query) use ($filter) {
                $query->whereIn('author_id', $filter['author']);
            })
            ->limit($filter['limit'] ?? -1)
            ->get();

        return CheckerResource::collection($checkers)->response()->setStatusCode(200);
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
