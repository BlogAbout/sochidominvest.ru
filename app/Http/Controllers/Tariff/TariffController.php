<?php

namespace App\Http\Controllers\Tariff;

use App\Http\Controllers\Controller;
use App\Http\Resources\TariffResource;
use App\Models\Tariff;

class TariffController extends Controller
{
    public function index()
    {
        $tariffs = Tariff::all();

        return TariffResource::collection($tariffs)->response()->setStatusCode(200);
    }

    public function show(Tariff $tariff)
    {
        return (new TariffResource($tariff))->response()->setStatusCode(200);
    }
}
