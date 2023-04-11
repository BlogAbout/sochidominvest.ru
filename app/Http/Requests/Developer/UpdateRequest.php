<?php

namespace App\Http\Requests\Developer;

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
            'description' => 'nullable|string',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'type' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'avatar_id' => 'nullable|integer|exists:sdi_attachments,id'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Это поле обязательно для заполнения',
            'name.string' => 'Значение данного поля должно быть строкой',
            'description.string' => 'Значение данного поля должно быть строкой',
            'address.string' => 'Значение данного поля должно быть строкой',
            'phone.string' => 'Значение данного поля должно быть строкой',
            'type.string' => 'Значение данного поля должно быть строкой',
            'is_active.boolean' => 'Значение данного поля должно быть переключателем',
            'avatar_id.integer' => 'Значение данного поля должно быть числом',
            'avatar_id.exists' => 'Изображение отсутствует в базе данных'
        ];
    }
}
