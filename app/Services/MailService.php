<?php

namespace App\Services;

use App\Http\Requests\Mail\StoreRequest;
use App\Http\Requests\Mail\UpdateRequest;
use App\Http\Resources\MailResource;
use App\Models\Mail;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MailService
{
    public function index()
    {
        $mails = Mail::all();

        return MailResource::collection($mails)->response()->setStatusCode(200);
    }

    public function show(Mail $mail)
    {
        return (new MailResource($mail))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();

            DB::beginTransaction();

            $mail = new Mail;
            $mail->fill(
                array_merge($data, [
                    'author_id' => Auth::user()->id
                ])
            )->save();

            if (isset($data['by_roles'])) {
                $userIds = DB::table('sdi_users')->whereIn('role_id', $data['by_roles'])->pluck('id');
                $mail->recipients()->attach($userIds);
            }

            DB::commit();

            $mail->refresh();

            return (new MailResource($mail))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, Mail $mail)
    {
        try {
            $data = $request->validated();

            DB::beginTransaction();

            $mail->update($data);

            if (isset($data['by_roles'])) {
                $userIds = DB::table('sdi_users')->whereIn('role_id', $data['by_roles'])->pluck('id');
                $mail->recipients()->sync($userIds);
            }

            DB::commit();

            $mail->refresh();

            return (new MailResource($mail))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Mail $mail)
    {
        $mail->delete();

        return response([])->setStatusCode(200);
    }
}
