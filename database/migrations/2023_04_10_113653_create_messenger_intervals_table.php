<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMessengerIntervalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_messenger_intervals', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('messenger_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('message_start_id')->nullable();
            $table->unsignedBigInteger('message_last_id')->nullable();

            $table->index('messenger_id', 'interval_messenger_idx');
            $table->index('user_id', 'interval_user_idx');
            $table->foreign('messenger_id', 'messenger_interval_messenger_fk')->on('sdi_messengers')->references('id');
            $table->foreign('user_id', 'messenger_interval_user_fk')->on('sdi_users')->references('id');
            $table->foreign('message_start_id', 'messenger_interval_message_start_fk')->on('sdi_messenger_messages')->references('id');
            $table->foreign('message_last_id', 'messenger_interval_message_last_fk')->on('sdi_messenger_messages')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sdi_messenger_intervals');
    }
}
