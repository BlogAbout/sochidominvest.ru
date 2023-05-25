<?php

namespace App\Schedules;

use App\Mail\MailDefault;
use App\Models\Mail as Mailing;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class MailingSender
{
    public function __invoke()
    {
        $mail = Mailing::where('status', 1)->first();

        if (!$mail) {
            return;
        }

        try {
            DB::beginTransaction();

            if (!$mail->recipients->count()) {
                $mail->fill(['status' => 2])->save();
            } else {
                $recipient = $mail->recipients[0];

                DB::table('sdi_mails')
                    ->where('mail_id', $mail->id)
                    ->where('user_id', $recipient->id)
                    ->delete();

                Mail::to($recipient)->send((new MailDefault($mail))->afterCommit());
            }

            DB::commit();

        } catch (Exception $e) {
            DB::rollBack();

            $mail->fill(['status' => -1])->save();
        }
    }
}
