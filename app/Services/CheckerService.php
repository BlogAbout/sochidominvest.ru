<?php

namespace App\Services;

use App\Http\Requests\Checker\StoreRequest;
use App\Http\Requests\Checker\UpdateRequest;
use App\Http\Resources\CheckerResource;
use App\Models\Checker;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CheckerService
{
    private $buildingService;

    public function __construct(BuildingService $buildingService)
    {
        $this->buildingService = $buildingService;
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
        try {
            $data = $request->validated();

            DB::beginTransaction();

            $checker = new Checker;
            $checker->fill(
                array_merge($data, [
                    'author_id' => Auth::user()->id
                ])
            )->save();

            $this->buildingService->updateMinMaxForBuilding($checker->building_id);

            DB::commit();

            $checker->refresh();

            return (new CheckerResource($checker))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, Checker $checker)
    {
        try {
            $data = $request->validated();

            DB::beginTransaction();

            $checker->update($data);

            $this->buildingService->updateMinMaxForBuilding($checker->building_id);

            DB::commit();

            return (new CheckerResource($checker))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Checker $checker)
    {
        $checker->delete();

        return response([])->setStatusCode(200);
    }
}
