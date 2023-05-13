<?php

namespace App\Http\Requests\Setting;

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
            'settings' => 'required|array'
        ];
    }

    public function messages(): array
    {
        return [
            'settings.required' => 'Это поле обязательно для заполнения',
            'settings.array' => 'Значение данного поля должно быть массивом'
        ];
    }
}
