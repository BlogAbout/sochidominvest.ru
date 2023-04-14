<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\StoreRequest;
use App\Http\Requests\Transaction\UpdateRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use App\Services\TransactionService;

class TransactionController extends Controller
{
    public $service;

    public function __construct(TransactionService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $transactions = Transaction::all();

        return TransactionResource::collection($transactions)->response()->setStatusCode(200);
    }

    public function show(Transaction $transaction)
    {
        return (new TransactionResource($transaction))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();

        return $this->service->store($data);
    }

    public function update(UpdateRequest $request, Transaction $transaction)
    {
        $data = $request->validated();

        return $this->service->update($data, $transaction);
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();

        return response([])->setStatusCode(200);
    }
}
