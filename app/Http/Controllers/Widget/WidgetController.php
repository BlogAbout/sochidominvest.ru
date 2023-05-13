<?php

namespace App\Http\Controllers\Widget;

use App\Http\Controllers\Controller;
use App\Http\Requests\Widget\StoreRequest;
use App\Http\Requests\Widget\UpdateRequest;
use App\Models\Widget;
use App\Services\WidgetService;

class WidgetController extends Controller
{
    public $service;

    public function __construct(WidgetService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return $this->service->index();
    }

    public function show(Widget $widget)
    {
        return $this->service->show($widget);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, Widget $widget)
    {
        return $this->service->update($request, $widget);
    }

    public function destroy(Widget $widget)
    {
        return $this->service->destroy($widget);
    }
}
