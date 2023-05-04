<?php

namespace App\Http\Requests\Product;

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
            'cost' => 'nullable|numeric',
            'cost_old' => 'nullable|numeric',
            'is_active' => 'nullable|boolean',
            'category_id' => 'nullable|integer|exists:sdi_categories,id',
            'avatar_id' => 'nullable|integer|exists:sdi_attachments,id',
            'fields' => 'nullable|array',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'image_ids' => 'nullable|array',
            'image_ids.*' => 'nullable|integer|exists:sdi_attachments,id',
            'video_ids' => 'nullable|array',
            'video_ids.*' => 'nullable|integer|exists:sdi_attachments,id'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Это поле обязательно для заполнения',
            'name.string' => 'Значение данного поля должно быть строкой',
            'description.string' => 'Значение данного поля должно быть строкой',
            'cost.numeric' => 'Значение данного поля должно быть числом',
            'cost_old.numeric' => 'Значение данного поля должно быть числом',
            'is_active.boolean' => 'Значение данного поля должно быть переключателем',
            'category_id.integer' => 'Значение данного поля должно быть числом',
            'category_id.exists' => 'Категория отсутствует в базе данных',
            'avatar_id.integer' => 'Значение данного поля должно быть числом',
            'avatar_id.exists' => 'Изображение отсутствует в базе данных',
            'fields.array' => 'Значение данного поля должно быть массивом',
            'meta_title.string' => 'Значение данного поля должно быть строкой',
            'meta_description.string' => 'Значение данного поля должно быть строкой',
            'image_ids.array' => 'Значение данного поля должно быть массивом',
            'video_ids.array' => 'Значение данного поля должно быть массивом'
        ];
    }
}
