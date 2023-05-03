<?php

namespace App\Http\Requests\Category;

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
            'is_active' => 'nullable|boolean',
            'avatar_id' => 'nullable|integer|exists:sdi_attachments,id',
            'fields' => 'nullable|array',
            'fields.*' => 'nullable',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Это поле обязательно для заполнения',
            'name.string' => 'Значение данного поля должно быть строкой',
            'description.string' => 'Значение данного поля должно быть строкой',
            'is_active.boolean' => 'Значение данного поля должно быть переключателем',
            'avatar_id.integer' => 'Значение данного поля должно быть числом',
            'avatar_id.exists' => 'Изображение отсутствует в базе данных',
            'fields.array' => 'Значение данного поля должно быть массивом',
            'meta_title.string' => 'Значение данного поля должно быть строкой',
            'meta_description.string' => 'Значение данного поля должно быть строкой',
        ];
    }
}
