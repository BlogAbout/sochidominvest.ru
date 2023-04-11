<?php

namespace App\Http\Requests\Building;

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
            'address' => 'nullable|string',
            'coordinates' => 'nullable|string',
            'type' => 'nullable|string',
            'status' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'is_publish' => 'nullable|boolean',
            'is_rent' => 'nullable|integer',
            'area' => 'nullable|decimal:5,2',
            'cost' => 'nullable|decimal:11,2',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'image_ids' => 'nullable|array',
            'image_ids.*' => 'nullable|integer|exists:sdi_attachments,id',
            'video_ids' => 'nullable|array',
            'video_ids.*' => 'nullable|integer|exists:sdi_attachments,id',
            'developer_ids' => 'nullable|array',
            'developer_ids.*' => 'nullable|integer|exists:sdi_developers,id',
            'agent_ids' => 'nullable|array',
            'agent_ids.*' => 'nullable|integer|exists:sdi_agents,id',
            'contact_ids' => 'nullable|array',
            'contact_ids.*' => 'nullable|integer|exists:sdi_contacts,id',
            'document_ids' => 'nullable|array',
            'document_ids.*' => 'nullable|integer|exists:sdi_documents,id',
            'article_ids' => 'nullable|array',
            'article_ids.*' => 'nullable|integer|exists:sdi_articles,id',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'nullable|integer|exists:sdi_tags,id',
            'info' => 'nullable'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Это поле обязательно для заполнения',
            'name.string' => 'Значение данного поля должно быть строкой',
            'description.string' => 'Значение данного поля должно быть строкой',
            'address.string' => 'Значение данного поля должно быть строкой',
            'coordinates.string' => 'Значение данного поля должно быть строкой',
            'type.string' => 'Значение данного поля должно быть строкой',
            'status.string' => 'Значение данного поля должно быть строкой',
            'is_active.boolean' => 'Значение данного поля должно быть переключателем',
            'is_publish.boolean' => 'Значение данного поля должно быть переключателем',
            'is_rent.boolean' => 'Значение данного поля должно быть переключателем',
            'area.integer' => 'Значение данного поля должно быть числом',
            'cost.integer' => 'Значение данного поля должно быть числом',
            'meta_title.decimal' => 'Значение данного поля должно быть числом',
            'meta_description.decimal' => 'Значение данного поля должно быть числом',
            'image_ids.array' => 'Значение данного поля должно быть массивом',
            'video_ids.array' => 'Значение данного поля должно быть массивом',
            'developer_ids.array' => 'Значение данного поля должно быть массивом',
            'agent_ids.array' => 'Значение данного поля должно быть массивом',
            'contact_ids.array' => 'Значение данного поля должно быть массивом',
            'document_ids.array' => 'Значение данного поля должно быть массивом',
            'article_ids.array' => 'Значение данного поля должно быть массивом',
            'tag_ids.array' => 'Значение данного поля должно быть массивом'
        ];
    }
}
