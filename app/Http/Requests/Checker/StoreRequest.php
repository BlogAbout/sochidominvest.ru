<?php

namespace App\Http\Requests\Checker;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'building_id' => 'nullable|integer|exists:sdi_buildings,id',
            'area' => 'nullable|decimal:5,2',
            'cost' => 'nullable|decimal:11,2',
            'furnish' => 'nullable|string',
            'housing' => 'nullable|integer',
            'stage' => 'nullable|string',
            'rooms' => 'nullable|integer',
            'status' => 'nullable|string',
            'is_active' => 'nullable|boolean'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Это поле обязательно для заполнения',
            'name.string' => 'Значение данного поля должно быть строкой',
            'building_id.integer' => 'Значение данного поля должно быть числом',
            'building_id.exists' => 'Недвижимость отсутствует в базе данных',
            'area.decimal' => 'Значение данного поля должно быть числом',
            'cost.decimal' => 'Значение данного поля должно быть числом',
            'furnish.string' => 'Значение данного поля должно быть строкой',
            'housing.integer' => 'Значение данного поля должно быть числом',
            'stage.string' => 'Значение данного поля должно быть строкой',
            'rooms.integer' => 'Значение данного поля должно быть числом',
            'status.string' => 'Значение данного поля должно быть строкой',
            'is_active.boolean' => 'Значение данного поля должно быть переключателем'
        ];
    }
}
