<?php

namespace App\Http\Controllers\Question;

use App\Http\Controllers\Controller;
use App\Http\Requests\Question\StoreRequest;
use App\Http\Requests\Question\UpdateRequest;
use App\Models\Question;
use App\Services\QuestionService;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public $service;

    public function __construct(QuestionService $service)
    {
        return $this->service = $service;
    }

    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    public function show(Question $question)
    {
        return $this->service->show($question);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, Question $question)
    {
        return $this->service->update($request, $question);
    }

    public function destroy(Question $question)
    {
        return $this->service->destroy($question);
    }
}
