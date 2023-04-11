<?php

namespace App\Http\Requests\Notification;

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
            'description' => 'nullable|string',
            'type' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'object_id' => 'nullable|integer',
            'object_type' => 'nullable|string',
            'user_ids' => 'nullable|array',
            'user_ids.*' => 'nullable|integer|exists:sdi_buildings,id'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Это поле обязательно для заполнения',
            'name.string' => 'Значение данного поля должно быть строкой',
            'description.string' => 'Значение данного поля должно быть строкой',
            'type.string' => 'Значение данного поля должно быть строкой',
            'is_active.boolean' => 'Значение данного поля должно быть переключателем',
            'object_id.integer' => 'Значение данного поля должно быть числом',
            'object_type.string' => 'Значение данного поля должно быть строкой',
            'user_ids.array' => 'Значение данного поля должно быть массивом'
        ];
    }
}
