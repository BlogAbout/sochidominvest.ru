<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Http\Requests\Document\StoreRequest;
use App\Http\Requests\Document\UpdateRequest;
use App\Models\Document;
use App\Services\DocumentService;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public $service;

    public function __construct(DocumentService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    public function show(Document $document)
    {
        return $this->service->show($document);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, Document $document)
    {
        return $this->service->update($request, $document);
    }

    public function destroy(Document $document)
    {
        return $this->service->destroy($document);
    }
}
