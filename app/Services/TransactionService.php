<?php

namespace App\Services;

use App\Http\Requests\Transaction\StoreRequest;
use App\Http\Requests\Transaction\UpdateRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransactionService
{
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
        try {
            $data = $request->validated();
            $sendLink = $data['sendLink'] ?? false;

            DB::beginTransaction();

            $transaction = new Transaction;
            $transaction->fill(
                array_merge($data['payment'], [
                    'user_id' => $data['payment']['user_id'] ?? Auth::user()->id
                ])
            )->save();

            DB::commit();

            $transaction->refresh();

            return (new TransactionResource($transaction))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, Transaction $transaction)
    {
        try {
            $data = $request->validated();
            $sendLink = $data['sendLink'] ?? false;

            DB::beginTransaction();

            $transaction->update($data['payment']);

            DB::commit();

            $transaction->refresh();

            return (new TransactionResource($transaction))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();

        return response([])->setStatusCode(200);
    }
}
