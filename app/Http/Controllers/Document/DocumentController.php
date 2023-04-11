<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Http\Requests\Document\StoreRequest;
use App\Http\Requests\Document\UpdateRequest;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use Exception;

class DocumentController extends Controller
{
    public function index()
    {
        $documents = Document::all();

        return DocumentResource::collection($documents)->response()->setStatusCode(200);
    }

    public function show(Document $document)
    {
        return (new DocumentResource($document))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();
            $data['author_id'] = auth()->user()->id;

            $document = Document::create($data);

            return (new DocumentResource($document))->response()->setStatusCode(201);
        } catch (Exception $e) {
            return response($e->getMessage())->setStatusCode(400);
        }
    }

    public function update(UpdateRequest $request, Document $document)
    {
        try {
            $data = $request->validated();

            $document->update($data);

            return (new DocumentResource($document))->response()->setStatusCode(200);
        } catch (Exception $e) {
            return response($e->getMessage())->setStatusCode(400);
        }
    }

    public function destroy(Document $document)
    {
        $document->delete();

        return response([])->setStatusCode(200);
    }
}
