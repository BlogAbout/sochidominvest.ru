<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class RegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phone' => ['required'],
            'email' => ['required', 'email'],
            'name' => ['required'],
            'password' => ['required']
        ];
    }

    public function messages(): array
    {
        return [
            'phone.required' => 'Это поле обязательно для заполнения',
            'email.required' => 'Это поле обязательно для заполнения',
            'name.required' => 'Это поле обязательно для заполнения',
            'password.required' => 'Это поле обязательно для заполнения'
        ];
    }
}
