<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFeedMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sdi_feed_messages', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('feed_id')->nullable();
            $table->unsignedBigInteger('author_id')->nullable();
            $table->string('status')->default('new');
            $table->text('content')->nullable();
            $table->boolean('is_active')->default(1);

            $table->timestamps();

            $table->index('feed_id', 'feed_message_feed_idx');
            $table->foreign('feed_id', 'feed_message_feed_fk')->on('sdi_feeds')->references('id');

            $table->index('author_id', 'feed_message_user_idx');
            $table->foreign('author_id', 'feed_message_user_fk')->on('sdi_users')->references('id');

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
        Schema::dropIfExists('sdi_feed_messages');
    }
}
