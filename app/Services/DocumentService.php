<?php

namespace App\Services;

use App\Http\Requests\Document\StoreRequest;
use App\Http\Requests\Document\UpdateRequest;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DocumentService
{
    public function index(Request $request)
    {
        $filter = $request->all();

        $documents = Document::query()
            ->when(isset($filter['id']), function ($query) use ($filter) {
                $query->whereIn('id', $filter['id']);
            })
            ->when(isset($filter['active']), function ($query) use ($filter) {
                $query->whereIn('is_active', $filter['active']);
            })
            ->when(isset($filter['text']), function ($query) use ($filter) {
                $query->where('name', 'like', '%' . $filter['text'] . '%');
            })
            ->limit($filter['limit'] ?? -1)
            ->get();

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

            $document = new Document;
            $document->fill(
                array_merge($data, [
                    'author_id' => Auth::user()->id
                ])
            )->save();

            return (new DocumentResource($document))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, Document $document)
    {
        try {
            $data = $request->validated();

            $document->update($data);

            return (new DocumentResource($document))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Document $document)
    {
        $document->delete();

        return response([])->setStatusCode(200);
    }
}
