<?php

namespace App\Http\Controllers\Setting;

use App\Facades\Setting;
use App\Http\Controllers\Controller;
use App\Http\Requests\Setting\StoreRequest;
use Exception;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::get();

        return response(['data' => $settings])->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();

            Setting::set($data['settings']);

            $settings = Setting::get();

            return response(['data' => $settings])->setStatusCode(200);
        } catch (Exception $e) {
            return response(['message' => $e->getMessage()])->setStatusCode(400);
        }
    }
}
