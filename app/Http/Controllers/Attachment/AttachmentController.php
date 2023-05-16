<?php

namespace App\Http\Controllers\Attachment;

use App\Http\Controllers\Controller;
use App\Http\Requests\Attachment\StoreRequest;
use App\Http\Requests\Attachment\UpdateRequest;
use App\Models\Attachment;
use App\Services\AttachmentService;
use Illuminate\Http\Request;

class AttachmentController extends Controller
{
    public $service;

    public function __construct(AttachmentService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    public function show(Attachment $attachment)
    {
        return $this->service->show($attachment);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, Attachment $attachment)
    {
        return $this->service->update($request, $attachment);
    }

    public function destroy(Attachment $attachment)
    {
        return $this->service->destroy($attachment);
    }
}
