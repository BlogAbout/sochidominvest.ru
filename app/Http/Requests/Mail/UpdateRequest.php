<?php

namespace App\Http\Requests\Mail;

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
            'content' => 'nullable|string',
            'content_html' => 'nullable|string',
            'type' => 'nullable|string',
            'status' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'recipient_ids' => 'nullable|array',
            'recipient_ids.*' => 'nullable|integer|exists:sdi_users,id',
            'by_roles' => 'nullable|array',
            'by_roles.*' => 'nullable|integer|exists:sdi_roles,id'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Это поле обязательно для заполнения',
            'name.string' => 'Значение данного поля должно быть строкой',
            'content.string' => 'Значение данного поля должно быть строкой',
            'content_html.string' => 'Значение данного поля должно быть строкой',
            'type.string' => 'Значение данного поля должно быть строкой',
            'status.integer' => 'Значение данного поля должно быть числом',
            'is_active.boolean' => 'Значение данного поля должно быть переключателем',
            'recipient_ids.array' => 'Значение данного поля должно быть массивом',
            'by_roles.array' => 'Значение данного поля должно быть массивом'
        ];
    }
}
