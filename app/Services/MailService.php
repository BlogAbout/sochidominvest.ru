<?php

namespace App\Services;

use App\Http\Resources\MailResource;
use App\Models\Mail;
use Exception;
use Illuminate\Support\Facades\DB;

class MailService
{
    public function store(array $data)
    {
        try {
            DB::beginTransaction();

            $data['author_id'] = auth()->user()->id;

            $mail = Mail::firstOrCreate($data);

            // Todo: заполнить список получателей

            DB::commit();

            return (new MailResource($mail))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }

    public function update(array $data, Mail $mail)
    {
        try {
            DB::beginTransaction();

            $mail->update($data);

            // Todo: заполнить список получателей

            DB::commit();

            return (new MailResource($mail))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }
}
