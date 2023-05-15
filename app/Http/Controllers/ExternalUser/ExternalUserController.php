<?php

namespace App\Http\Controllers\ExternalUser;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExternalUser\StoreRequest;
use App\Http\Requests\ExternalUser\UpdateRequest;
use App\Models\ExternalUser;
use App\Services\ExternalUserService;

class ExternalUserController extends Controller
{
    public $service;

    public function __construct(ExternalUserService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return $this->service->index();
    }

    public function show(ExternalUser $externalUser)
    {
        return $this->service->show($externalUser);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, ExternalUser $externalUser)
    {
        return $this->service->update($request, $externalUser);
    }

    public function destroy(ExternalUser $externalUser)
    {
        return $this->service->destroy($externalUser);
    }
}
