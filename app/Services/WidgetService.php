<?php

namespace App\Services;

use App\Http\Requests\Widget\StoreRequest;
use App\Http\Requests\Widget\UpdateRequest;
use App\Http\Resources\WidgetResource;
use App\Models\Widget;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class WidgetService
{
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
        try {
            $data = $request->validated();

            DB::beginTransaction();

            $widget = new Widget;
            $widget->fill(
                array_merge($data, [
                    'author_id' => Auth::user()->id
                ])
            )->save();

            if (isset($data['items'])) {
                // Todo: Обработать сохранение элементов
            }

            DB::commit();

            $widget->refresh();

            return (new WidgetResource($widget))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, Widget $widget)
    {
        try {
            $data = $request->validated();

            DB::beginTransaction();

            $widget->update($data);

            if (isset($data['items'])) {
                // Todo: Обработать сохранение элементов
            }

            DB::commit();

            $widget->refresh();

            return (new WidgetResource($widget))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Widget $widget)
    {
        $widget->delete();

        return response([])->setStatusCode(200);
    }
}
