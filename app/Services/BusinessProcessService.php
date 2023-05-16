<?php

namespace App\Services;

use App\Http\Requests\BusinessProcess\StoreRequest;
use App\Http\Requests\BusinessProcess\UpdateRequest;
use App\Http\Resources\BusinessProcessResource;
use App\Models\BusinessProcess;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BusinessProcessService
{
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
        try {
            $data = $request->validated();

            DB::beginTransaction();

            $businessProcess = new BusinessProcess;
            $businessProcess->fill(
                array_merge($data, [
                    'author_id' => Auth::user()->id
                ])
            )->save();

            if (isset($data['relations'])) {
                $buildingIds = $this->getMappingRelations($data['relations']);
                $feedIds = $this->getMappingRelations($data['relations'], 'feed');
            }

            isset($data['attendee_ids']) && $businessProcess->attendees()->attach($data['attendee_ids']);
            isset($buildingIds) && $businessProcess->buildings()->attach($buildingIds);
            isset($feedIds) && $businessProcess->feeds()->attach($feedIds);

            DB::commit();

            $businessProcess->refresh();

            return (new BusinessProcessResource($businessProcess))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, BusinessProcess $businessProcess)
    {
        try {
            $data = $request->validated();

            DB::beginTransaction();

            $businessProcess->update($data);

            if (isset($data['relations'])) {
                $buildingIds = $this->getMappingRelations($data['relations']);
                $feedIds = $this->getMappingRelations($data['relations'], 'feed');
            }

            isset($data['attendee_ids']) && $businessProcess->attendees()->sync($data['attendee_ids']);
            isset($buildingIds) && $businessProcess->buildings()->sync($buildingIds);
            isset($feedIds) && $businessProcess->feeds()->sync($feedIds);

            DB::commit();

            $businessProcess->refresh();

            return (new BusinessProcessResource($businessProcess))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(BusinessProcess $businessProcess)
    {
        $businessProcess->delete();

        return response([])->setStatusCode(200);
    }

    /**
     * Формирование массива идентификаторов связанных объектов в зависимости от типа
     *
     * @param array $relations Массив связей
     * @param string $type Тип искомой связи
     * @return array
     */
    private function getMappingRelations(array $relations = [], string $type = 'building'): array
    {
        $ids = [];

        if (count($relations)) {
            foreach ($relations as $relation) {
                if ($relation['object_type'] === $type) {
                    array_push($ids, $relation['object_id']);
                }
            }
        }

        return $ids;
    }
}
