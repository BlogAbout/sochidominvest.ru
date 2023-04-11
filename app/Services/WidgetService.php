<?php

namespace App\Services;

use App\Http\Resources\WidgetResource;
use App\Models\Widget;
use Exception;
use Illuminate\Support\Facades\DB;

class WidgetService
{
    public function store(array $data)
    {
        try {
            DB::beginTransaction();

            $data['author_id'] = auth()->user()->id;

            if (isset($data['items'])) {
                $items = $data['items'];
                unset($data['items']);
            }

            $widget = Widget::firstOrCreate($data);

            if (isset($items)) {
                // Todo: Обработать сохранение элементов
            }

            DB::commit();

            return (new WidgetResource($widget))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }

    public function update(array $data, Widget $widget)
    {
        try {
            DB::beginTransaction();

            if (isset($data['items'])) {
                $items = $data['items'];
                unset($data['items']);
            }

            $widget->update($data);

            if (isset($items)) {
                // Todo: Обработать сохранение элементов
            }

            DB::commit();

            return (new WidgetResource($widget))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }
}
