<?php

namespace App\Http\Requests\Transaction;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'status' => 'nullable|string',
            'user_id' => 'nullable|integer|exists:sdi_users,id',
            'email' => 'nullable|string',
            'cost' => 'nullable|numeric',
            'object_id' => 'nullable|integer',
            'object_type' => 'nullable|string',
            'duration' => 'nullable|string'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Это поле обязательно для заполнения',
            'name.string' => 'Значение данного поля должно быть строкой',
            'status.string' => 'Значение данного поля должно быть строкой',
            'user_id.integer' => 'Значение данного поля должно быть числом',
            'user_id.exists' => 'Пользователь отсутствует в базе данных',
            'email.string' => 'Значение данного поля должно быть строкой',
            'cost.numeric' => 'Значение данного поля должно быть числом',
            'object_id.integer' => 'Значение данного поля должно быть числом',
            'object_type.string' => 'Значение данного поля должно быть строкой',
            'duration.string' => 'Значение данного поля должно быть строкой'
        ];
    }
}
