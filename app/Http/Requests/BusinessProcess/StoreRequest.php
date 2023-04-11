<?php

namespace App\Http\Requests\BusinessProcess;

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
            'step' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'responsible_id ' => 'nullable|integer|exists:sdi_users,id'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Это поле обязательно для заполнения',
            'name.string' => 'Значение данного поля должно быть строкой',
            'description.string' => 'Значение данного поля должно быть строкой',
            'type.string' => 'Значение данного поля должно быть строкой',
            'step.string' => 'Значение данного поля должно быть строкой',
            'is_active.boolean' => 'Значение данного поля должно быть переключателем',
            'responsible_id.integer' => 'Значение данного поля должно быть числом',
            'responsible_id.exists' => 'Пользователь отсутствует в базе данных'
        ];
    }
}
