<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Http\Requests\Agent\StoreRequest;
use App\Http\Requests\Agent\UpdateRequest;
use App\Http\Resources\AgentResource;
use App\Models\Agent;
use Exception;

class AgentController extends Controller
{
    public function index()
    {
        $agents = Agent::all();

//        dd($agents);

        return AgentResource::collection($agents)->response()->setStatusCode(200);
    }

    public function show(Agent $agent)
    {
        return (new AgentResource($agent))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();
            $data['author_id'] = auth()->user()->id;

            $agent = Agent::create($data);

            return (new AgentResource($agent))->response()->setStatusCode(201);
        } catch (Exception $e) {
            return response($e->getMessage())->setStatusCode(400);
        }
    }

    public function update(UpdateRequest $request, Agent $agent)
    {
        try {
            $data = $request->validated();

            $agent->update($data);

            return (new AgentResource($agent))->response()->setStatusCode(200);
        } catch (Exception $e) {
            return response($e->getMessage())->setStatusCode(400);
        }
    }

    public function destroy(Agent $agent)
    {
        $agent->delete();

        return response([])->setStatusCode(200);
    }
}
