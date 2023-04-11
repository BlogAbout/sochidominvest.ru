<?php

namespace App\Http\Controllers\Widget;

use App\Http\Controllers\Controller;
use App\Http\Requests\Widget\StoreRequest;
use App\Http\Requests\Widget\UpdateRequest;
use App\Http\Resources\WidgetResource;
use App\Models\Widget;
use App\Services\WidgetService;

class WidgetController extends Controller
{
    public $service;

    public function __construct()
    {
        $this->service = new WidgetService();
    }

    public function index()
    {
        $widgets = Widget::all();

        return WidgetResource::collection($widgets)->response()->setStatusCode(200);
    }

    public function show(Widget $widget)
    {
        return (new WidgetResource($widget))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();

        return $this->service->store($data);
    }

    public function update(UpdateRequest $request, Widget $widget)
    {
        $data = $request->validated();

        return $this->service->update($data, $widget);
    }

    public function destroy(Widget $widget)
    {
        $widget->delete();

        return response([])->setStatusCode(200);
    }
}
