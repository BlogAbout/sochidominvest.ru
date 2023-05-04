<?php

namespace App\Http\Controllers\Setting;

use App\Http\Controllers\Controller;
use App\Http\Requests\Setting\StoreRequest;
use App\Http\Resources\SettingResource;
use App\Models\Setting;
use Exception;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all();

        return SettingResource::collection($settings)->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();

            $arrayForStore = [];
            foreach($data['settings'] as $key => $value) {
                array_push($arrayForStore, [
                    'name' => $key,
                    'value' => $value
                ]);
            }

            Setting::upsert($arrayForStore, ['name'], ['value']);

            $settings = Setting::all();

            return SettingResource::collection($settings)->response()->setStatusCode(200);
        } catch (Exception $e) {
            return response($e->getMessage())->setStatusCode(400);
        }
    }
}
