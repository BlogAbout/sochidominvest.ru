<?php

namespace App\Http\Controllers\Mail;

use App\Http\Controllers\Controller;
use App\Http\Requests\Mail\StoreRequest;
use App\Http\Requests\Mail\UpdateRequest;
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
        return $this->service->index();
    }

    public function show(Mail $mail)
    {
        return $this->service->show($mail);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, Mail $mail)
    {
        return $this->service->update($request, $mail);
    }

    public function destroy(Mail $mail)
    {
        return $this->service->destroy($mail);
    }
}
