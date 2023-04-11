<?php

namespace App\Services;

use App\Http\Resources\AttachmentResource;
use App\Models\Attachment;
use Exception;
use Illuminate\Support\Facades\DB;

class AttachmentService
{
    public function store(array $data)
    {
        try {
            DB::beginTransaction();

            $data['author_id'] = auth()->user()->id;

            // Todo: получить расширение файла $data['extension']
            // Todo: получить ссылку на файл $data['content']

            $attachment = Attachment::firstOrCreate($data);

            DB::commit();

            return (new AttachmentResource($attachment))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }

    public function update(array $data, Attachment $attachment)
    {
        try {
            DB::beginTransaction();

            // Todo: получить расширение файла $data['extension']
            // Todo: получить ссылку на файл $data['content']

            $attachment->update($data);

            DB::commit();

            return (new AttachmentResource($attachment))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }
}
