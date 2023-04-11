<?php

namespace App\Http\Controllers\Partner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Partner\StoreRequest;
use App\Http\Requests\Partner\UpdateRequest;
use App\Http\Resources\PartnerResource;
use App\Models\Partner;
use Exception;

class PartnerController extends Controller
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
            $data['author_id'] = auth()->user()->id;

            $partner = Partner::create($data);

            return (new PartnerResource($partner))->response()->setStatusCode(201);
        } catch (Exception $e) {
            return response($e->getMessage())->setStatusCode(400);
        }
    }

    public function update(UpdateRequest $request, Partner $partner)
    {
        try {
            $data = $request->validated();

            $partner->update($data);

            return (new PartnerResource($partner))->response()->setStatusCode(200);
        } catch (Exception $e) {
            return response($e->getMessage())->setStatusCode(400);
        }
    }

    public function destroy(Partner $partner)
    {
        $partner->delete();

        return response([])->setStatusCode(200);
    }
}
