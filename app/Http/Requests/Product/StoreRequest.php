<?php

namespace App\Http\Requests\Product;

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
            'cost' => 'nullable|decimal:11,2',
            'cost_old' => 'nullable|decimal:11,2',
            'is_active' => 'nullable|boolean',
            'category_id' => 'nullable|integer|exists:sdi_categories,id',
            'avatar_id' => 'nullable|integer|exists:sdi_attachments,id',
            'fields' => 'nullable|array',
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
            'cost.decimal' => 'Значение данного поля должно быть числом',
            'cost_old.decimal' => 'Значение данного поля должно быть числом',
            'is_active.boolean' => 'Значение данного поля должно быть переключателем',
            'category_id.integer' => 'Значение данного поля должно быть числом',
            'category_id.exists' => 'Категория отсутствует в базе данных',
            'avatar_id.integer' => 'Значение данного поля должно быть числом',
            'avatar_id.exists' => 'Изображение отсутствует в базе данных',
            'fields.array' => 'Значение данного поля должно быть массивом',
            'meta_title.string' => 'Значение данного поля должно быть строкой',
            'meta_description.string' => 'Значение данного поля должно быть строкой'
        ];
    }
}
