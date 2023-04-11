<?php

namespace App\Http\Requests\Article;

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
            'is_active' => 'nullable|integer',
            'is_publish' => 'nullable|integer',
            'avatar_id' => 'nullable|integer|exists:sdi_attachments,id',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'building_ids' => 'nullable|array',
            'building_ids.*' => 'nullable|integer|exists:sdi_buildings,id',
            'image_ids' => 'nullable|array',
            'image_ids.*' => 'nullable|integer|exists:sdi_attachments,id'
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
            'is_publish.boolean' => 'Значение данного поля должно быть переключателем',
            'avatar_id.integer' => 'Значение данного поля должно быть числом',
            'avatar_id.exists' => 'Изображение отсутствует в базе данных',
            'meta_title.string' => 'Значение данного поля должно быть строкой',
            'meta_description.string' => 'Значение данного поля должно быть строкой',
            'building_ids.array' => 'Значение данного поля должно быть массивом',
            'image_ids.array' => 'Значение данного поля должно быть массивом'
        ];
    }
}
