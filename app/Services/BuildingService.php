<?php

namespace App\Services;

use App\Http\Requests\Building\StoreRequest;
use App\Http\Requests\Building\UpdateRequest;
use App\Http\Resources\BuildingResource;
use App\Models\Building;
use App\Models\BuildingInfo;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BuildingService
{
    private $priceService;

    public function __construct(PriceService $priceService)
    {
        $this->priceService = $priceService;
    }

    public function index(Request $request)
    {
        $filter = $request->all();

        $buildings = Building::query()
            ->when(isset($filter['id']), function ($query) use ($filter) {
                $query->whereIn('id', $filter['id']);
            })
            ->when(isset($filter['active']), function ($query) use ($filter) {
                $query->whereIn('is_active', $filter['active']);
            })
            ->when(isset($filter['publish']), function ($query) use ($filter) {
                $query->where('is_publish', '=', $filter['publish']);
            })
            ->when(isset($filter['rent']), function ($query) use ($filter) {
                $query->whereIn('is_rent', $filter['rent']);
            })
            ->when(isset($filter['author']), function ($query) use ($filter) {
                $query->whereIn('author_id', $filter['author']);
            })
            ->when(isset($filter['type']), function ($query) use ($filter) {
                $query->where('type', '=', $filter['type']);
            })
            ->limit($filter['limit'] ?? -1)
            ->get();

        return BuildingResource::collection($buildings)->response()->setStatusCode(200);
    }

    public function show(Building $building)
    {
        $building->increment('views');

        return (new BuildingResource($building))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();

            DB::beginTransaction();

            $building = new BUilding;
            $building->fill(
                array_merge($data, [
                    'author_id' => Auth::user()->id
                ])
            )->save();

            $buildingInfo = new BuildingInfo;
            $buildingInfo->fill(
                array_merge($data['info'], [
                    'id' => $building->id
                ])
            )->save();

            isset($data['image_ids']) && $building->images()->attach($data['image_ids']);
            isset($data['video_ids']) && $building->videos()->attach($data['video_ids']);
            isset($data['developer_ids']) && $building->relationDevelopers()->attach($data['developer_ids']);
            isset($data['agent_ids']) && $building->relationAgents()->attach($data['agent_ids']);
            isset($data['contact_ids']) && $building->relationContacts()->attach($data['contact_ids']);
            isset($data['document_ids']) && $building->relationDocuments()->attach($data['document_ids']);
            isset($data['article_ids']) && $building->articles()->attach($data['article_ids']);
            isset($data['tag_ids']) && $building->tags()->attach($data['tag_ids']);

            DB::commit();

            $building->refresh();

            return (new BuildingResource($building))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, Building $building)
    {
        try {
            $data = $request->validated();

            DB::beginTransaction();

            if ($building->type !== 'building' && isset($data['cost']) && $building->cost !== $data['cost']) {
                $this->priceService->store([
                    'object_id' => $building->id,
                    'object_type' => Building::class,
                    'date_update' => now()->setTime(0, 0, 0),
                    'cost' => $data['cost']
                ]);
            }

            $building->update($data);

            BuildingInfo::updateOrCreate(['id' => $building->id], $data['info']);

            isset($data['image_ids']) && $building->images()->sync($data['image_ids']);
            isset($data['video_ids']) && $building->videos()->sync($data['video_ids']);
            isset($data['developer_ids']) && $building->relationDevelopers()->sync($data['developer_ids']);
            isset($data['agent_ids']) && $building->relationAgents()->sync($data['agent_ids']);
            isset($data['contact_ids']) && $building->relationContacts()->sync($data['contact_ids']);
            isset($data['document_ids']) && $building->relationDocuments()->sync($data['document_ids']);
            isset($data['article_ids']) && $building->articles()->sync($data['article_ids']);
            isset($data['tag_ids']) && $building->tags()->sync($data['tag_ids']);

            if ($building->type === 'building') {
                $this->updateMinMaxForBuilding($building->id);
            }

            DB::commit();

            $building->refresh();

            return (new BuildingResource($building))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Building $building)
    {
        $building->delete();

        return response([])->setStatusCode(200);
    }

    public function updateMinMaxForBuilding(int $buildingId)
    {
        $values = DB::table('sdi_checkers')
            ->select(DB::raw('MIN(`area`) as areaMin, MAX(`area`) as areaMax, MIN(`cost`) as costMin, MAX(`cost`) as costMax, MIN(`cost` / `area`) as costMinUnit'))
            ->where('building_id', $buildingId)
            ->where('is_active', 1)
            ->first();

        Building::where('id', $buildingId)->update([
            'area_min' => $values->areaMin,
            'area_max' => $values->areaMax,
            'cost_min' => $values->costMin,
            'cost_max' => $values->costMax,
            'cost_min_unit' => $values->costMinUnit,
        ]);
    }
}
