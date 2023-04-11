<?php

namespace App\Http\Requests\Attachment;

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
            'content' => 'nullable|string',
            'type' => 'nullable|string',
            'extension' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'poster_id' => 'nullable|integer|exists:sdi_attachments,id'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Это поле обязательно для заполнения',
            'name.string' => 'Значение данного поля должно быть строкой',
            'description.string' => 'Значение данного поля должно быть строкой',
            'content.string' => 'Значение данного поля должно быть строкой',
            'type.string' => 'Значение данного поля должно быть строкой',
            'extension.string' => 'Значение данного поля должно быть строкой',
            'is_active.boolean' => 'Значение данного поля должно быть переключателем',
            'poster_id.integer' => 'Значение данного поля должно быть числом',
            'poster_id.exists' => 'Изображение отсутствует в базе данных'
        ];
    }
}
