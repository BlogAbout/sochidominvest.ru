<?php

namespace App\Services;

use App\Http\Requests\Agent\StoreRequest;
use App\Http\Requests\Agent\UpdateRequest;
use App\Http\Resources\AgentResource;
use App\Models\Agent;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AgentService
{
    public function index()
    {
        $agents = Agent::all();

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

            $agent = new Agent;
            $agent->fill(
                array_merge($data, [
                    'author_id' => Auth::user()->id
                ])
            )->save();

            return (new AgentResource($agent))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, Agent $agent)
    {
        try {
            $data = $request->validated();

            $agent->update($data);

            return (new AgentResource($agent))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Agent $agent)
    {
        $agent->delete();

        return response([])->setStatusCode(200);
    }
}
