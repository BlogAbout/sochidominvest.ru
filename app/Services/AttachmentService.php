<?php

namespace App\Services;

use App\Http\Resources\AttachmentResource;
use App\Models\Attachment;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class AttachmentService
{
    public function store(array $data)
    {
        try {
            DB::beginTransaction();

            $errorMimeType = false;
            $file = $data['file'];
            $type = $data['type'];
            $mimeType = $file->getClientMimeType();
            $extension = $file->extension();

            switch($type) {
                case 'image': {
                    if (!in_array($mimeType, ['image/jpeg', 'image/png'])) {
                        $errorMimeType = true;
                    }
                    break;
                }
                case 'document': {
                    if (!in_array($mimeType, [
                        'image/jpeg', 'image/png', 'application/msword', 'application/pdf', 'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    ])) {
                        $errorMimeType = true;
                    }
                    break;
                }
                case 'video': {
                    if (!in_array($mimeType, ['video/mp4'])) {
                        $errorMimeType = true;
                    }
                    break;
                }
            }

            if ($errorMimeType) {
                return response(['message' => 'Загружаемый файл имеет неподдерживаемый формат. Попробуйте загрузить другой файл.'])->setStatusCode(500);
            }

            $fileUrl = Storage::disk('public')->put('/' . $type, $file);
            $fileName = explode('/', $fileUrl)[1];

            $this->resizeImage($fileName, 400, 400);
            $this->resizeImage($fileName, 2000, 2000, true);

            $attachmentData = [
                'name' => '',
                'content' => $fileName,
                'author_id' => Auth::user()->id,
                'type' => $type,
                'extension' => $extension
            ];

            $attachment = Attachment::firstOrCreate($attachmentData);

            DB::commit();

            return (new AttachmentResource($attachment))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(array $data, Attachment $attachment)
    {
        try {
            DB::beginTransaction();

            $attachment->update($data);

            DB::commit();

            return (new AttachmentResource($attachment))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    private function resizeImage(string $fileName, int $width, int $height, bool $isFull = false)
    {
        $catalog = 'thumb/';
        if ($isFull) {
            $catalog = 'full/';
        }

        $pathToFile = Storage::path('public/image/' . $fileName);

        $resizeImageThumb = Image::make($pathToFile)->resize($width, $height, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });

        $resizeImageThumb->save(storage_path() . '/app/public/image/' . $catalog . $fileName);
    }
}
