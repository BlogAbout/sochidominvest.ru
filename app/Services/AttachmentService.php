<?php

namespace App\Services;

use App\Facades\Setting;
use App\Http\Requests\Attachment\StoreRequest;
use App\Http\Requests\Attachment\UpdateRequest;
use App\Http\Resources\AttachmentResource;
use App\Models\Attachment;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class AttachmentService
{
    public function index(Request $request)
    {
        $filter = $request->all();

        $attachments = Attachment::query()
            ->when(isset($filter['id']), function ($query) use ($filter) {
                $query->whereIn('id', $filter['id']);
            })
            ->when(isset($filter['author']), function ($query) use ($filter) {
                $query->whereIn('author_id', $filter['author']);
            })
            ->when(isset($filter['type']), function ($query) use ($filter) {
                $query->where('type', '=', $filter['type']);
            })
            ->when(isset($filter['text']), function ($query) use ($filter) {
                $query->where('name', 'like', '%' . $filter['text'] . '%');
            })
            ->limit($filter['limit'] ?? -1)
            ->get();

        return AttachmentResource::collection($attachments)->response()->setStatusCode(200);
    }

    public function show(Attachment $attachment)
    {
        return (new AttachmentResource($attachment))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();

            DB::beginTransaction();

            $errorMimeType = false;
            $file = $data['file'];
            $type = $data['type'];
            $mimeType = $file->getClientMimeType();
            $extension = $file->extension();

            switch ($type) {
                case 'image':
                {
                    if (!in_array($mimeType, ['image/jpeg', 'image/png'])) {
                        $errorMimeType = true;
                    }
                    break;
                }
                case 'document':
                {
                    if (!in_array($mimeType, [
                        'image/jpeg', 'image/png', 'application/msword', 'application/pdf', 'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    ])) {
                        $errorMimeType = true;
                    }
                    break;
                }
                case 'video':
                {
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

            $this->resizeImage($fileName, (int)Setting::get('image_thumb_width', '400'), (int)Setting::get('image_thumb_height', '400'));
            $this->resizeImage($fileName, (int)Setting::get('image_full_width', '2000'), (int)Setting::get('image_full_height', '2000'), true);

            $attachment = new Attachment;
            $attachment->fill([
                'name' => '',
                'content' => $fileName,
                'author_id' => Auth::user()->id,
                'type' => $type,
                'extension' => $extension
            ])->save();

            DB::commit();

            return (new AttachmentResource($attachment))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, Attachment $attachment)
    {
        try {
            $data = $request->validated();

            DB::beginTransaction();

            $attachment->update($data);

            DB::commit();

            return (new AttachmentResource($attachment))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Attachment $attachment)
    {
        $attachment->delete();

        return response([])->setStatusCode(200);
    }

    private function resizeImage(string $fileName, int $width, int $height, bool $isFull = false): void
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
