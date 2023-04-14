<?php

namespace App\Http\Controllers\Attachment;

use App\Http\Controllers\Controller;
use App\Http\Requests\Attachment\StoreRequest;
use App\Http\Requests\Attachment\UpdateRequest;
use App\Http\Resources\AttachmentResource;
use App\Models\Attachment;
use App\Services\AttachmentService;

class AttachmentController extends Controller
{
    public $service;

    public function __construct(AttachmentService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $attachments = Attachment::all();

        return AttachmentResource::collection($attachments)->response()->setStatusCode(200);
    }

    public function show(Attachment $attachment)
    {
        return (new AttachmentResource($attachment))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();

        return $this->service->store($data);
    }

    public function update(UpdateRequest $request, Attachment $attachment)
    {
        $data = $request->validated();

        return $this->service->update($data, $attachment);
    }

    public function destroy(Attachment $attachment)
    {
        $attachment->delete();

        return response([])->setStatusCode(200);
    }
}
