<?php

namespace App\Http\Requests\Transaction;

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
            'payment' => 'required|array',
            'payment.name' => 'required|string',
            'payment.status' => 'nullable|string',
            'payment.user_id' => 'nullable|integer|exists:sdi_users,id',
            'payment.email' => 'nullable|string',
            'payment.cost' => 'nullable|numeric',
            'payment.object_id' => 'nullable|integer',
            'payment.object_type' => 'nullable|string',
            'payment.duration' => 'nullable|string',
            'sendLink' => 'nullable|boolean'
        ];
    }

    public function messages(): array
    {
        return [
            'payment.required' => 'Это поле обязательно для заполнения',
            'payment.array' => 'Значение данного поля должно быть массивом',
            'payment.name.required' => 'Это поле обязательно для заполнения',
            'payment.name.string' => 'Значение данного поля должно быть строкой',
            'payment.status.string' => 'Значение данного поля должно быть строкой',
            'payment.user_id.integer' => 'Значение данного поля должно быть числом',
            'payment.user_id.exists' => 'Пользователь отсутствует в базе данных',
            'payment.email.string' => 'Значение данного поля должно быть строкой',
            'payment.cost.numeric' => 'Значение данного поля должно быть числом',
            'payment.object_id.integer' => 'Значение данного поля должно быть числом',
            'payment.object_type.string' => 'Значение данного поля должно быть строкой',
            'payment.duration.string' => 'Значение данного поля должно быть строкой',
            'sendLink.boolean' => 'Значение данного поля должно быть переключателем'
        ];
    }
}
