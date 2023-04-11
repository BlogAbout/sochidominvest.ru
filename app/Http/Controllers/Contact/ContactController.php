<?php

namespace App\Http\Controllers\Contact;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\StoreRequest;
use App\Http\Requests\Contact\UpdateRequest;
use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Exception;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::all();

        return ContactResource::collection($contacts)->response()->setStatusCode(200);
    }

    public function show(Contact $contact)
    {
        return (new ContactResource($contact))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();
            $data['author_id'] = auth()->user()->id;

            $contact = Contact::create($data);

            return (new ContactResource($contact))->response()->setStatusCode(201);
        } catch (Exception $e) {
            return response($e->getMessage())->setStatusCode(400);
        }
    }

    public function update(UpdateRequest $request, Contact $contact)
    {
        try {
            $data = $request->validated();

            $contact->update($data);

            return (new ContactResource($contact))->response()->setStatusCode(200);
        } catch (Exception $e) {
            return response($e->getMessage())->setStatusCode(400);
        }
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();

        return response([])->setStatusCode(200);
    }
}
