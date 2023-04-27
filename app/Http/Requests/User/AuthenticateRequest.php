<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class AuthenticateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'password' => ['required']
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Это поле обязательно для заполнения',
            'password.required' => 'Это поле обязательно для заполнения'
        ];
    }
}
