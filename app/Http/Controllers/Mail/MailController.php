<?php

namespace App\Http\Controllers\Mail;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mail\StoreRequest;
use App\Http\Requests\Mail\UpdateRequest;
use App\Http\Resources\MailResource;
use App\Models\Mail;
use App\Services\MailService;

class MailController extends Controller
{
    public $service;

    public function __construct(MailService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $mails = Mail::all();

        return MailResource::collection($mails)->response()->setStatusCode(200);
    }

    public function show(Mail $mail)
    {
        return (new MailResource($mail))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();

        return $this->service->store($data);
    }

    public function update(UpdateRequest $request, Mail $mail)
    {
        $data = $request->validated();

        return $this->service->update($data, $mail);
    }

    public function destroy(Mail $mail)
    {
        $mail->delete();

        return response([])->setStatusCode(200);
    }
}
