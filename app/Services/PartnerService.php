<?php

namespace App\Services;

use App\Http\Requests\Partner\StoreRequest;
use App\Http\Requests\Partner\UpdateRequest;
use App\Http\Resources\PartnerResource;
use App\Models\Partner;
use Exception;
use Illuminate\Support\Facades\Auth;

class PartnerService
{
    public function index()
    {
        $partners = Partner::all();

        return PartnerResource::collection($partners)->response()->setStatusCode(200);
    }

    public function show(Partner $partner)
    {
        return (new PartnerResource($partner))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();

            $partner = new Partner;
            $partner->fill(
                array_merge($data, [
                    'author_id' => Auth::user()->id
                ])
            )->save();

            $partner->refresh();

            return (new PartnerResource($partner))->response()->setStatusCode(201);
        } catch (Exception $e) {
            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, Partner $partner)
    {
        try {
            $data = $request->validated();

            $partner->update($data);

            $partner->refresh();

            return (new PartnerResource($partner))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Partner $partner)
    {
        $partner->delete();

        return response([])->setStatusCode(200);
    }
}
