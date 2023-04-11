<?php

namespace App\Http\Requests\Document;

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
            'content' => 'nullable|string',
            'type' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'attachment_id' => 'nullable|integer|exists:sdi_attachments,id',
            'object_id' => 'nullable|integer',
            'object_type' => 'nullable|string'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Это поле обязательно для заполнения',
            'name.string' => 'Значение данного поля должно быть строкой',
            'content.string' => 'Значение данного поля должно быть строкой',
            'type.string' => 'Значение данного поля должно быть строкой',
            'is_active.boolean' => 'Значение данного поля должно быть переключателем',
            'attachment_id.integer' => 'Значение данного поля должно быть числом',
            'attachment_id.exists' => 'Изображение отсутствует в базе данных',
            'object_id.integer' => 'Значение данного поля должно быть числом',
            'object_type.string' => 'Значение данного поля должно быть строкой'
        ];
    }
}
