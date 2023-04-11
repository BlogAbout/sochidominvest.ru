<?php

namespace App\Http\Requests\Widget;

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
            'type' => 'nullable|string',
            'style' => 'nullable|string',
            'page' => 'nullable|string',
            'ordering' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'items' => 'nullable|array'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Это поле обязательно для заполнения',
            'name.string' => 'Значение данного поля должно быть строкой',
            'type.string' => 'Значение данного поля должно быть строкой',
            'style.string' => 'Значение данного поля должно быть строкой',
            'page.string' => 'Значение данного поля должно быть строкой',
            'ordering.integer' => 'Значение данного поля должно быть числом',
            'is_active.boolean' => 'Значение данного поля должно быть переключателем',
            'items.array' => 'Значение данного поля должно быть массивом'
        ];
    }
}
