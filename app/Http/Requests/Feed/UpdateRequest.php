<?php

namespace App\Http\Requests\Feed;

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
            'title' => 'required|string',
            'type' => 'nullable|string',
            'status' => 'nullable|string',
            'user_id ' => 'nullable|integer|exists:sdi_users,id',
            'phone' => 'nullable|string',
            'name' => 'nullable|string',
            'object_id' => 'nullable|integer',
            'object_type' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'message_text' => 'nullable|string'
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Это поле обязательно для заполнения',
            'title.string' => 'Значение данного поля должно быть строкой',
            'type.string' => 'Значение данного поля должно быть строкой',
            'status.string' => 'Значение данного поля должно быть строкой',
            'user_id.integer' => 'Значение данного поля должно быть числом',
            'user_id.exists' => 'Пользователь отсутствует в базе данных',
            'phone.string' => 'Значение данного поля должно быть строкой',
            'name.string' => 'Значение данного поля должно быть строкой',
            'object_id.integer' => 'Значение данного поля должно быть числом',
            'object_type.string' => 'Значение данного поля должно быть строкой',
            'is_active.boolean' => 'Значение данного поля должно быть переключателем',
            'message_text.string' => 'Значение данного поля должно быть строкой'
        ];
    }
}
