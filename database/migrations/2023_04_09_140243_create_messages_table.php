<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_messenger_messages', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('messenger_id')->nullable();
            $table->unsignedBigInteger('message_id')->nullable();
            $table->string('type')->default('message');
            $table->text('text')->nullable();

            $table->unsignedBigInteger('author_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->boolean('is_active')->default(1);

            $table->timestamps();

            $table->index('messenger_id', 'message_messenger_idx');
            $table->foreign('messenger_id', 'message_messenger_fk')->on('sdi_messengers')->references('id');

            $table->index('message_id', 'message_message_idx');
            $table->foreign('message_id', 'message_message_fk')->on('sdi_messenger_messages')->references('id');

            $table->index('author_id', 'message_author_idx');
            $table->foreign('author_id', 'message_author_fk')->on('sdi_users')->references('id');

            $table->index('user_id', 'message_user_idx');
            $table->foreign('user_id', 'message_user_fk')->on('sdi_users')->references('id');

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sdi_messenger_messages');
    }
}
