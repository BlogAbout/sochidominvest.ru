<?php

namespace App\Http\Controllers\Question;

use App\Http\Controllers\Controller;
use App\Http\Requests\Question\StoreRequest;
use App\Http\Requests\Question\UpdateRequest;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use Exception;

class QuestionController extends Controller
{
    public function index()
    {
        $questions = Question::all();

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
            $data['author_id'] = auth()->user()->id;

            $question = Question::create($data);

            return (new QuestionResource($question))->response()->setStatusCode(201);
        } catch (Exception $e) {
            return response($e->getMessage())->setStatusCode(400);
        }
    }

    public function update(UpdateRequest $request, Question $question)
    {
        try {
            $data = $request->validated();

            $question->update($data);

            return (new QuestionResource($question))->response()->setStatusCode(200);
        } catch (Exception $e) {
            return response($e->getMessage())->setStatusCode(400);
        }
    }

    public function destroy(Question $question)
    {
        $question->delete();

        return response([])->setStatusCode(200);
    }
}
