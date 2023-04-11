<?php

namespace App\Http\Requests\Contact;

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
            'phone' => 'nullable|string',
            'is_active' => 'nullable|integer',
            'avatar_id' => 'nullable|integer|exists:sdi_attachments,id',
            'agent_id' => 'nullable|integer|exists:sdi_agents,id',
            'post_id' => 'nullable|integer|exists:sdi_posts,id'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Это поле обязательно для заполнения',
            'name.string' => 'Значение данного поля должно быть строкой',
            'phone.string' => 'Значение данного поля должно быть строкой',
            'is_active.boolean' => 'Значение данного поля должно быть переключателем',
            'avatar_id.integer' => 'Значение данного поля должно быть числом',
            'avatar_id.exists' => 'Изображение отсутствует в базе данных',
            'agent_id.integer' => 'Значение данного поля должно быть числом',
            'agent_id.exists' => 'Агентство отсутствует в базе данных',
            'post_id.integer' => 'Значение данного поля должно быть числом',
            'post_id.exists' => 'Должность отсутствует в базе данных',
        ];
    }
}
