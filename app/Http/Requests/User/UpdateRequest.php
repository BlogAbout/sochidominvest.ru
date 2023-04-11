<?php

namespace App\Http\Requests\User;

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
            'email' => 'nullable|string',
            'password' => 'nullable|string',
            'phone' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'is_block' => 'nullable|boolean',
            'settings' => 'nullable|array',
            'settings.*' => 'nullable',
            'avatar_id' => 'nullable|integer|exists:sdi_attachments,id',
            'role_id' => 'nullable|integer|exists:sdi_roles,id',
            'post_id' => 'nullable|integer|exists:sdi_posts,id'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Это поле обязательно для заполнения',
            'name.string' => 'Значение данного поля должно быть строкой',
            'email.string' => 'Значение данного поля должно быть строкой',
            'password.string' => 'Значение данного поля должно быть строкой',
            'phone.string' => 'Значение данного поля должно быть строкой',
            'is_active.boolean' => 'Значение данного поля должно быть переключателем',
            'is_block.boolean' => 'Значение данного поля должно быть переключателем',
            'settings.array' => 'Значение данного поля должно быть массивом',
            'avatar_id.integer' => 'Значение данного поля должно быть числом',
            'avatar_id.exists' => 'Изображение отсутствует в базе данных',
            'role_id.integer' => 'Значение данного поля должно быть числом',
            'role_id.exists' => 'Роль отсутствует в базе данных',
            'post_id.integer' => 'Значение данного поля должно быть числом',
            'post_id.exists' => 'Должность отсутствует в базе данных'
        ];
    }
}
