<?php

namespace App\Services;

use App\Http\Requests\Question\StoreRequest;
use App\Http\Requests\Question\UpdateRequest;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuestionService
{
    public function index(Request $request)
    {
        $filter = $request->all();

        $questions = Question::query()
            ->when(isset($filter['id']), function ($query) use ($filter) {
                $query->whereIn('id', $filter['id']);
            })
            ->when(isset($filter['active']), function ($query) use ($filter) {
                $query->whereIn('is_active', $filter['active']);
            })
            ->when(isset($filter['author']), function ($query) use ($filter) {
                $query->whereIn('author_id', $filter['author']);
            })
            ->when(isset($filter['type']), function ($query) use ($filter) {
                $query->where('type', '=', $filter['type']);
            })
            ->limit($filter['limit'] ?? -1)
            ->get();

        return QuestionResource::collection($questions)->response()->setStatusCode(200);
    }

    public function show(Question $question)
    {
        return (new QuestionResource($question))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();

            $question = new Question;
            $question->fill(
                array_merge($data, [
                    'author_id' => Auth::user()->id
                ])
            )->save();

            $question->refresh();

            return (new QuestionResource($question))->response()->setStatusCode(201);
        } catch (Exception $e) {
            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, Question $question)
    {
        try {
            $data = $request->validated();

            $question->update($data);

            $question->refresh();

            return (new QuestionResource($question))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Question $question)
    {
        $question->delete();

        return response([])->setStatusCode(200);
    }
}
