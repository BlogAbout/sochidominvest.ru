<?php

namespace App\Services;

use App\Http\Requests\Contact\StoreRequest;
use App\Http\Requests\Contact\UpdateRequest;
use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ContactService
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

            $contact = new Contact;
            $contact->fill(
                array_merge($data, [
                    'author_id' => Auth::user()->id
                ])
            )->save();

            return (new ContactResource($contact))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, Contact $contact)
    {
        try {
            $data = $request->validated();

            $contact->update($data);

            return (new ContactResource($contact))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();

        return response([])->setStatusCode(200);
    }
}
