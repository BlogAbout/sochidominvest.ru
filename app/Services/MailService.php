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

            if (isset($data['by_roles'])) {
                $userIds = DB::table('sdi_users')->whereIn('role_id', $data['by_roles'])->pluck('id');

                $data['by_roles'] = implode(',', $data['by_roles']);
            }

            $mail = Mail::firstOrCreate($data);

            if (isset($userIds)) {
                $mail->recipients()->attach($userIds);
            }

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

            if (isset($data['by_roles'])) {
                $userIds = DB::table('sdi_users')->whereIn('role_id', $data['by_roles'])->pluck('id');

                $data['by_roles'] = implode(',', $data['by_roles']);
            }

            $mail->update($data);

            if (isset($userIds)) {
                $mail->recipients()->sync($userIds);
            }

            DB::commit();

            return (new MailResource($mail))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }
}
