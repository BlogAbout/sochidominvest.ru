<?php

namespace App\Services;

use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use Exception;
use Illuminate\Support\Facades\DB;

class TransactionService
{
    public function store(array $data)
    {
        try {
            DB::beginTransaction();

            $payment = $data['payment'];
            $sendLink = $data['sendLink'] ?? false;

            $payment['user_id'] = $payment['user_id'] ?? auth()->user()->id;

            $transaction = Transaction::firstOrCreate($payment);

            DB::commit();

            return (new TransactionResource($transaction))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }

    public function update(array $data, Transaction $transaction)
    {
        try {
            DB::beginTransaction();

            $payment = [
                'name' => $data['payment']['name'],
                'status' => $data['payment']['status'],
                'email' => $data['payment']['email'],
                'cost' => $data['payment']['cost'],
                'object_id' => $data['payment']['object_id'],
                'object_type' => $data['payment']['object_type'],
                'duration' => $data['payment']['duration']
            ];

            $sendLink = $data['sendLink'] ?? false;

            if (isset($payment['user'])) {
                unset($payment['user']);
            }

            $transaction->update($payment);

            $transaction->refresh();

            DB::commit();

            return (new TransactionResource($transaction))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }
}
