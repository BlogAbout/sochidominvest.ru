<?php

namespace App\Http\Controllers\Partner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Partner\StoreRequest;
use App\Http\Requests\Partner\UpdateRequest;
use App\Models\Partner;
use App\Services\PartnerService;
use Illuminate\Http\Request;

class PartnerController extends Controller
{
    public $service;

    public function __construct(PartnerService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    public function show(Partner $partner)
    {
        return $this->service->show($partner);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, Partner $partner)
    {
        return $this->service->update($request, $partner);
    }

    public function destroy(Partner $partner)
    {
        return $this->service->destroy($partner);
    }
}
