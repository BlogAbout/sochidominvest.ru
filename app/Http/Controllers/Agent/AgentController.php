<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Http\Requests\Agent\StoreRequest;
use App\Http\Requests\Agent\UpdateRequest;
use App\Models\Agent;
use App\Services\AgentService;

class AgentController extends Controller
{
    public $service;

    public function __construct(AgentService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return $this->service->index();
    }

    public function show(Agent $agent)
    {
        return $this->service->show($agent);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, Agent $agent)
    {
        return $this->service->update($request, $agent);
    }

    public function destroy(Agent $agent)
    {
        return $this->service->destroy($agent);
    }
}
