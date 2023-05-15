<?php

namespace App\Services;

use App\Http\Resources\BusinessProcessResource;
use App\Models\BusinessProcess;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BusinessProcessService
{
    public function store(array $data)
    {
        try {
            DB::beginTransaction();

            $data['author_id'] = Auth::user()->id;

            if (isset($data['relations'])) {
                $buildingIds = [];
                $feedIds = [];
                foreach($data['relations'] as $relation) {
                    if ($relation['object_type'] === 'building') {
                        array_push($buildingIds, $relation['object_id']);
                    }

                    if ($relation['object_type'] === 'feed') {
                        array_push($feedIds, $relation['object_id']);
                    }
                }
                unset($data['relations']);
            }

            if (isset($data['attendee_ids'])) {
                $attendeeIds = $data['attendee_ids'];
                unset($data['attendee_ids']);
            }

            $businessProcess = BusinessProcess::firstOrCreate($data);

            if (isset($attendeeIds)) {
                $businessProcess->attendees()->attach($attendeeIds);
            }

            if (isset($feedIds)) {
                $businessProcess->relationFeeds()->attach($feedIds);
            }

            if (isset($buildingIds)) {
                $businessProcess->relationBuildings()->attach($buildingIds);
            }

            DB::commit();

            return (new BusinessProcessResource($businessProcess))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(array $data, BusinessProcess $businessProcess)
    {
        try {
            DB::beginTransaction();

            if (isset($data['relations'])) {
                $buildingIds = [];
                $feedIds = [];
                foreach($data['relations'] as $relation) {
                    if ($relation['object_type'] === 'building') {
                        array_push($buildingIds, $relation['object_id']);
                    }

                    if ($relation['object_type'] === 'feed') {
                        array_push($feedIds, $relation['object_id']);
                    }
                }
                unset($data['relations']);
            }

            if (isset($data['attendee_ids'])) {
                $attendeeIds = $data['attendee_ids'];
                unset($data['attendee_ids']);
            }

            $businessProcess->update($data);

            if (isset($attendeeIds)) {
                $businessProcess->attendees()->sync($attendeeIds);
            }

            if (isset($feedIds)) {
                $businessProcess->relationFeeds()->sync($feedIds);
            }

            if (isset($buildingIds)) {
                $businessProcess->relationBuildings()->sync($buildingIds);
            }

            DB::commit();

            $businessProcess->refresh();

            return (new BusinessProcessResource($businessProcess))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }
}
