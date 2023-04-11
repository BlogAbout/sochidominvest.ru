<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMessengersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_messengers', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('type')->default('private');
            $table->unsignedBigInteger('author_id')->nullable();
            $table->unsignedBigInteger('avatar_id')->nullable();

            $table->timestamps();

            $table->index('author_id', 'messenger_user_idx');
            $table->foreign('author_id', 'messenger_user_fk')->on('sdi_users')->references('id');

            $table->index('avatar_id', 'messenger_attachment_idx');
            $table->foreign('avatar_id', 'messenger_attachment_fk')->on('sdi_attachments')->references('id');

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
        Schema::dropIfExists('sdi_messengers');
    }
}
