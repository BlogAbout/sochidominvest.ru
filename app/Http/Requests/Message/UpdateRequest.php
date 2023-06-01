<?php

namespace App\Http\Requests\Message;

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
            'text' => 'required|string',
            'messenger_id' => 'nullable|integer',
            'message_id' => 'nullable|integer',
            'type' => 'nullable|string',
            'user_id' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'attendee_ids' => 'nullable|array',
            'attendee_ids.*' => 'nullable|integer|exists:sdi_users,id'
        ];
    }

    public function messages(): array
    {
        return [
            'text.required' => 'Это поле обязательно для заполнения',
            'text.string' => 'Значение данного поля должно быть строкой',
            'messenger_id.integer' => 'Значение данного поля должно быть числом',
            'message_id.integer' => 'Значение данного поля должно быть числом',
            'type.string' => 'Значение данного поля должно быть строкой',
            'user_id.integer' => 'Значение данного поля должно быть числом',
            'is_active.boolean' => 'Значение данного поля должно быть переключателем',
            'attendee_ids.array' => 'Значение данного поля должно быть массивом'
        ];
    }
}
