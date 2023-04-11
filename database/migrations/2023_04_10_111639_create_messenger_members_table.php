<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMessengerMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_messenger_members', function (Blueprint $table) {
            $table->unsignedBigInteger('messenger_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('message_read_id')->nullable();
            $table->unsignedBigInteger('message_deleted_id')->nullable();
            $table->boolean('is_active')->default(1);

            $table->index(['messenger_id', 'user_id'], 'messenger_member_idx');
            $table->foreign('messenger_id', 'messenger_member_messenger_fk')->on('sdi_messengers')->references('id');
            $table->foreign('user_id', 'messenger_member_user_fk')->on('sdi_users')->references('id');
            $table->foreign('message_read_id', 'messenger_member_message_read_fk')->on('sdi_messenger_messages')->references('id');
            $table->foreign('message_deleted_id', 'messenger_member_message_deleted_fk')->on('sdi_messenger_messages')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sdi_messenger_members');
    }
}
