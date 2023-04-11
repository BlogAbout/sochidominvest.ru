<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMailRecipientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_mail_recipients', function (Blueprint $table) {
            $table->unsignedBigInteger('mail_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();

            $table->index(['mail_id', 'user_id'], 'mail_recipient_idx');
            $table->foreign('mail_id', 'recipient_mail_fk')->on('sdi_mails')->references('id');
            $table->foreign('user_id', 'recipient_user_fk')->on('sdi_users')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sdi_mail_recipients');
    }
}
