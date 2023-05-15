<?php

namespace App\Http\Controllers\Contact;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\StoreRequest;
use App\Http\Requests\Contact\UpdateRequest;
use App\Models\Contact;
use App\Services\ContactService;

class ContactController extends Controller
{
    public $service;

    public function __construct(ContactService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return $this->service->index();
    }

    public function show(Contact $contact)
    {
        return $this->service->show($contact);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, Contact $contact)
    {
        return $this->service->update($request, $contact);
    }

    public function destroy(Contact $contact)
    {
        return $this->service->destroy($contact);
    }
}
